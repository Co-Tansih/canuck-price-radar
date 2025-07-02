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
  json_response: true,
  premium_proxy: true,
  autoparse: true
};

app.use(cors());
app.use(express.json());

// (Keep all your existing scrape logic and routes here...)

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});




// Helper function to scrape Amazon products
async function scrapeAmazonProducts(query = 'power drill', category = 'power tools') {
  try {
    console.log(`Starting scrape for query: ${query}`);
    
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    const zenrowsUrl = new URL('https://api.zenrows.com/v1/');
    
    // Add ZenRows parameters
    zenrowsUrl.searchParams.append('apikey', ZENROWS_API_KEY);
    zenrowsUrl.searchParams.append('url', searchUrl);
    zenrowsUrl.searchParams.append('js_render', ZENROWS_CONFIG.js_render);
    zenrowsUrl.searchParams.append('json_response', ZENROWS_CONFIG.json_response);
    zenrowsUrl.searchParams.append('premium_proxy', ZENROWS_CONFIG.premium_proxy);
    zenrowsUrl.searchParams.append('autoparse', ZENROWS_CONFIG.autoparse);

    console.log('Making request to ZenRows...');
    const response = await fetch(zenrowsUrl.toString());
    
    if (!response.ok) {
      throw new Error(`ZenRows API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('ZenRows response received');

    // Parse the scraped data
    const products = [];
    
    if (data && data.products && Array.isArray(data.products)) {
      // If autoparse worked, use the parsed products
      data.products.forEach((product, index) => {
        if (product.title && product.price) {
          products.push({
            id: `scraped_${Date.now()}_${index}`,
            name: product.title,
            description: product.description || `${product.title} - High quality product`,
            price: parseFloat(product.price.replace(/[^\d.]/g, '')) || 0,
            image_url: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            category: category,
            affiliate_url: product.url || '#',
            asin: product.asin || null,
            rating: product.rating ? parseFloat(product.rating) : 4.5,
            status: 'active'
          });
        }
      });
    } else if (data && data.html) {
      // If we got HTML, try to parse it manually
      console.log('Parsing HTML manually...');
      
      // Basic HTML parsing for Amazon product listings
      const htmlContent = data.html;
      const productRegex = /<div[^>]*data-component-type="s-search-result"[^>]*>([\s\S]*?)<\/div>/gi;
      const matches = [...htmlContent.matchAll(productRegex)];
      
      matches.slice(0, 20).forEach((match, index) => {
        const productHtml = match[1];
        
        // Extract title
        const titleMatch = productHtml.match(/<span[^>]*class="[^"]*a-size-[^"]*"[^>]*>(.*?)<\/span>/i);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : null;
        
        // Extract price
        const priceMatch = productHtml.match(/<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([^<]+)</i);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/[^\d.]/g, '')) : 0;
        
        // Extract image
        const imgMatch = productHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
        const image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e';
        
        if (title && price > 0) {
          products.push({
            id: `scraped_${Date.now()}_${index}`,
            name: title,
            description: `${title} - High quality product`,
            price: price,
            image_url: image,
            category: category,
            affiliate_url: '#',
            asin: null,
            rating: 4.5,
            status: 'active'
          });
        }
      });
    }

    console.log(`Scraped ${products.length} products`);
    
    // Store in database
    if (products.length > 0) {
      // Clear old products for this category first
      await supabase
        .from('products')
        .delete()
        .eq('category', category);

      // Insert new products
      const { error } = await supabase
        .from('products')
        .insert(products);

      if (error) {
        console.error('Database insert error:', error);
      } else {
        console.log(`Stored ${products.length} products in database`);
      }

      // Cache the results
      cache.set(`products_${category}`, products);
      
      // Log scraping activity
      await supabase
        .from('scraper_logs')
        .insert({
          scraper_name: 'amazon-zenrows',
          status: 'success',
          products_scraped: products.length,
          message: `Successfully scraped ${products.length} products for ${category}`
        });
    }

    return products;
  } catch (error) {
    console.error('Scraping error:', error);
    
    // Log error
    await supabase
      .from('scraper_logs')
      .insert({
        scraper_name: 'amazon-zenrows',
        status: 'error',
        products_scraped: 0,
        message: error.message
      });

    throw error;
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
    
    console.log(`Manual scrape triggered for: ${query}`);
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
    cache_stats: cache.getStats()
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
  console.log(`Price tracking server running on port ${port}`);
  console.log('Scheduled scraping: Every day at 2 AM');
  console.log('Manual scraping available at: POST /api/scrape');
  console.log('Products API available at: GET /api/products');
});
