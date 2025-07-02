
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001;

// Initialize cache
const cache = new NodeCache({ stdTTL: 86400 });

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ZenRows config
const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY;
const ZENROWS_CONFIG = {
  js_render: true,
  json_response: false, // Changed to false to get raw HTML
  premium_proxy: true,
  autoparse: false // Changed to false for more control
};

app.use(cors());
app.use(express.json());

// Helper function to scrape Amazon products
async function scrapeAmazonProducts(query = 'power drill', category = 'power tools') {
  try {
    console.log(`🔍 Starting scrape for query: "${query}", category: "${category}"`);
    
    // Try multiple Amazon domains as fallbacks
    const domains = ['amazon.com', 'amazon.ca', 'amazon.co.uk'];
    let products = [];
    
    for (const domain of domains) {
      try {
        console.log(`🌐 Trying ${domain}...`);
        const searchUrl = `https://www.${domain}/s?k=${encodeURIComponent(query)}`;
        console.log(`📡 Search URL: ${searchUrl}`);
        
        const zenrowsUrl = new URL('https://api.zenrows.com/v1/');
        
        // Add ZenRows parameters
        zenrowsUrl.searchParams.append('apikey', ZENROWS_API_KEY);
        zenrowsUrl.searchParams.append('url', searchUrl);
        zenrowsUrl.searchParams.append('js_render', 'true');
        zenrowsUrl.searchParams.append('premium_proxy', 'true');

        console.log(`📞 Making request to ZenRows API...`);
        const response = await fetch(zenrowsUrl.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        console.log(`📊 ZenRows Response Status: ${response.status}`);
        console.log(`📊 ZenRows Response Headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          console.error(`❌ ZenRows API error: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error(`❌ Error response: ${errorText.substring(0, 500)}...`);
          continue; // Try next domain
        }

        const htmlContent = await response.text();
        console.log(`📄 Response length: ${htmlContent.length} characters`);
        console.log(`📄 Response preview: ${htmlContent.substring(0, 200)}...`);

        // Parse the HTML content
        products = parseAmazonHTML(htmlContent, category, domain);
        
        if (products.length > 0) {
          console.log(`✅ Successfully parsed ${products.length} products from ${domain}`);
          break; // Success, exit loop
        } else {
          console.log(`⚠️ No products found on ${domain}, trying next domain...`);
        }
        
      } catch (domainError) {
        console.error(`❌ Error with ${domain}:`, domainError.message);
        continue; // Try next domain
      }
    }

    if (products.length === 0) {
      console.log(`⚠️ No products found across all domains`);
      
      // Log scraping activity as warning
      await supabase
        .from('scraper_logs')
        .insert({
          scraper_name: 'amazon-zenrows',
          status: 'warning',
          products_scraped: 0,
          message: `No products found for query: "${query}" across all domains`
        });
        
      return products;
    }

    console.log(`💾 Storing ${products.length} products in database...`);
    
    // Store in database
    // Clear old products for this category first
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('category', category);

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError);
    }

    // Insert new products
    const { error: insertError } = await supabase
      .from('products')
      .insert(products);

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log(`✅ Successfully stored ${products.length} products in database`);

    // Cache the results
    cache.set(`products_${category}`, products);
    
    // Log scraping activity
    await supabase
      .from('scraper_logs')
      .insert({
        scraper_name: 'amazon-zenrows',
        status: 'success',
        products_scraped: products.length,
        message: `Successfully scraped ${products.length} products for "${query}" in category "${category}"`
      });

    return products;
  } catch (error) {
    console.error('❌ Scraping error:', error);
    
    // Log error
    await supabase
      .from('scraper_logs')
      .insert({
        scraper_name: 'amazon-zenrows',
        status: 'error',
        products_scraped: 0,
        message: `Scraping failed: ${error.message}`
      });

    throw error;
  }
}

// Enhanced HTML parsing function
function parseAmazonHTML(htmlContent, category, domain) {
  console.log(`🔍 Parsing HTML content from ${domain}...`);
  
  const products = [];
  
  try {
    // Multiple selector patterns for different Amazon layouts
    const productSelectors = [
      'div[data-component-type="s-search-result"]',
      'div[data-cy="title-recipe-component"]',
      'div.s-result-item',
      'div[data-asin]:not([data-asin=""])',
      '.s-search-result'
    ];
    
    let foundProducts = false;
    
    for (const selector of productSelectors) {
      console.log(`🔍 Trying selector: ${selector}`);
      
      // Use regex to find products since we don't have DOM parser
      const productRegex = new RegExp(`<div[^>]*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>([\\s\\S]*?)</div>`, 'gi');
      const matches = [...htmlContent.matchAll(productRegex)];
      
      console.log(`📊 Found ${matches.length} potential products with selector: ${selector}`);
      
      if (matches.length > 0) {
        foundProducts = true;
        
        matches.slice(0, 20).forEach((match, index) => {
          try {
            const productHtml = match[1];
            const product = extractProductInfo(productHtml, category, index, domain);
            
            if (product && product.name && product.price > 0) {
              products.push(product);
              console.log(`✅ Extracted product: ${product.name} - $${product.price}`);
            }
          } catch (parseError) {
            console.error(`❌ Error parsing product ${index}:`, parseError.message);
          }
        });
        
        if (products.length > 0) {
          break; // Found products, no need to try other selectors
        }
      }
    }
    
    if (!foundProducts) {
      console.log(`⚠️ No product containers found. Checking if page loaded correctly...`);
      
      // Check for common Amazon elements
      const indicators = [
        'amazon',
        'search-result',
        's-result-item',
        'data-asin',
        'price'
      ];
      
      indicators.forEach(indicator => {
        const count = (htmlContent.match(new RegExp(indicator, 'gi')) || []).length;
        console.log(`📊 Found "${indicator}" ${count} times in HTML`);
      });
      
      // Save a sample of the HTML for debugging
      console.log(`📄 HTML sample (first 1000 chars): ${htmlContent.substring(0, 1000)}`);
    }
    
  } catch (error) {
    console.error('❌ HTML parsing error:', error);
  }
  
  console.log(`✅ Total products extracted: ${products.length}`);
  return products;
}

// Extract product information from HTML
function extractProductInfo(productHtml, category, index, domain) {
  try {
    // Enhanced title extraction with multiple patterns
    const titlePatterns = [
      /<span[^>]*class="[^"]*a-size-[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<h2[^>]*class="[^"]*s-size-[^"]*"[^>]*>.*?<span[^>]*>([^<]+)<\/span>/i,
      /<a[^>]*class="[^"]*a-link-normal[^"]*"[^>]*>([^<]+)<\/a>/i,
      /title="([^"]+)"/i,
      /alt="([^"]+)"/i
    ];
    
    let title = null;
    for (const pattern of titlePatterns) {
      const match = productHtml.match(pattern);
      if (match && match[1]) {
        title = match[1].trim();
        break;
      }
    }
    
    // Enhanced price extraction
    const pricePatterns = [
      /<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<span[^>]*class="[^"]*a-price-range[^"]*"[^>]*>([^<]+)<\/span>/i,
      /\$([0-9,]+\.?[0-9]*)/i,
      /CAD\s*([0-9,]+\.?[0-9]*)/i,
      /£([0-9,]+\.?[0-9]*)/i
    ];
    
    let price = 0;
    for (const pattern of pricePatterns) {
      const match = productHtml.match(pattern);
      if (match && match[1]) {
        price = parseFloat(match[1].replace(/[^\d.]/g, ''));
        if (price > 0) break;
      }
    }
    
    // Enhanced image extraction
    const imagePatterns = [
      /<img[^>]*src="([^"]*)"[^>]*>/i,
      /<img[^>]*data-src="([^"]*)"[^>]*>/i
    ];
    
    let image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e';
    for (const pattern of imagePatterns) {
      const match = productHtml.match(pattern);
      if (match && match[1] && match[1].includes('http')) {
        image = match[1];
        break;
      }
    }
    
    // Extract ASIN if available
    const asinMatch = productHtml.match(/data-asin="([^"]+)"/i);
    const asin = asinMatch ? asinMatch[1] : null;
    
    if (!title) {
      console.log(`⚠️ No title found for product ${index}`);
      return null;
    }
    
    if (price <= 0) {
      console.log(`⚠️ No valid price found for product: ${title}`);
      // Still include the product but with a default price
      price = 0;
    }
    
    const product = {
      id: `scraped_${Date.now()}_${index}`,
      name: title,
      description: `${title} - High quality product from ${domain}`,
      price: price,
      image_url: image,
      category: category,
      affiliate_url: asin ? `https://www.${domain}/dp/${asin}` : '#',
      asin: asin,
      rating: 4.5,
      status: 'active'
    };
    
    return product;
    
  } catch (error) {
    console.error(`❌ Error extracting product info:`, error);
    return null;
  }
}

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category = 'power tools', query } = req.query;
    
    // Try cache first
    const cacheKey = `products_${category}`;
    let products = cache.get(cacheKey);
    
    if (!products) {
      // Try database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      products = data || [];
      
      if (products.length > 0) {
        cache.set(cacheKey, products);
      }
    }

    // If no products found, trigger scraping
    if (products.length === 0) {
      console.log('No products found, triggering scrape...');
      try {
        products = await scrapeAmazonProducts(query || category, category);
      } catch (scrapeError) {
        console.error('Scraping failed:', scrapeError);
        return res.status(500).json({ 
          error: 'Failed to scrape products',
          details: scrapeError.message 
        });
      }
    }

    res.json({
      success: true,
      products: products,
      count: products.length,
      cached: cache.has(cacheKey)
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual scrape trigger
app.post('/api/scrape', async (req, res) => {
  try {
    const { query = 'power drill', category = 'power tools' } = req.body;
    
    console.log(`🚀 Manual scrape triggered for: "${query}" in category: "${category}"`);
    console.log(`🔑 Using ZenRows API Key: ${ZENROWS_API_KEY ? ZENROWS_API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
    
    const products = await scrapeAmazonProducts(query, category);
    
    res.json({
      success: true,
      message: `Successfully scraped ${products.length} products`,
      products: products,
      count: products.length
    });
  } catch (error) {
    console.error('Manual scrape error:', error);
    res.status(500).json({ 
      error: 'Scraping failed',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    cache_stats: cache.getStats(),
    zenrows_key: ZENROWS_API_KEY ? 'configured' : 'missing'
  });
});

// Schedule automatic scraping every 24 hours at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running scheduled scrape...');
  try {
    await scrapeAmazonProducts('power drill', 'power tools');
    await scrapeAmazonProducts('laptop', 'electronics');
    await scrapeAmazonProducts('smartphone', 'electronics');
    console.log('Scheduled scrape completed');
  } catch (error) {
    console.error('Scheduled scrape failed:', error);
  }
});

app.listen(port, () => {
  console.log(`✅ Price tracking server running on port ${port}`);
  console.log('📅 Scheduled scraping: Every day at 2 AM');
  console.log('🛠️ Manual scraping available at: POST /api/scrape');
  console.log('📦 Products API available at: GET /api/products');
  console.log('🔑 ZenRows API Key:', ZENROWS_API_KEY ? 'Configured' : '❌ NOT CONFIGURED');
});
