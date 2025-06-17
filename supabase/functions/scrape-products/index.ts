
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
    if (!rapidApiKey) {
      throw new Error('RAPIDAPI_KEY not configured')
    }

    const { store, query, category } = await req.json()

    let products = []
    let scraperName = ''

    // Amazon scraping with affiliate links
    if (store === 'amazon' || !store) {
      scraperName = 'Amazon Scraper'
      const amazonResponse = await fetch('https://real-time-amazon-data.p.rapidapi.com/search', {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query || category || 'electronics',
          page: '1',
          country: 'CA',
          sort_by: 'RELEVANCE',
          product_condition: 'ALL'
        })
      })

      if (amazonResponse.ok) {
        const amazonData = await amazonResponse.json()
        if (amazonData.data && amazonData.data.products) {
          products = amazonData.data.products.slice(0, 10).map((item: any) => ({
            name: item.product_title || 'Amazon Product',
            description: item.product_title || '',
            price: parseFloat(item.product_price?.replace(/[^0-9.]/g, '') || '0'),
            category: category || 'Electronics',
            image_url: item.product_photo || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            affiliate_url: `https://amzn.to/4065yhg?tag=yourstore-20&linkCode=ogi&th=1&psc=1&asin=${item.asin}`,
            store: 'Amazon',
            external_id: item.asin,
            rating: parseFloat(item.product_star_rating || '4.0'),
            reviews: parseInt(item.product_num_ratings || '100'),
            availability: item.delivery || 'Available'
          }))
        }
      }
    }

    // Walmart scraping
    if (store === 'walmart' || !store) {
      scraperName = store ? 'Walmart Scraper' : 'Multi-Store Scraper'
      const walmartResponse = await fetch('https://walmart-api2.p.rapidapi.com/search', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'walmart-api2.p.rapidapi.com',
        },
      })

      if (walmartResponse.ok) {
        const walmartData = await walmartResponse.json()
        if (walmartData.items) {
          const walmartProducts = walmartData.items.slice(0, 10).map((item: any) => ({
            name: item.name || 'Walmart Product',
            description: item.shortDescription || item.name || '',
            price: parseFloat(item.priceInfo?.currentPrice?.price || '0'),
            category: category || 'General',
            image_url: item.imageInfo?.thumbnailUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
            affiliate_url: item.canonicalUrl || '#',
            store: 'Walmart',
            external_id: item.itemId?.toString(),
            rating: parseFloat(item.averageRating || '4.0'),
            reviews: parseInt(item.numberOfReviews || '50'),
            availability: item.availabilityStatus || 'Available'
          }))
          products = [...products, ...walmartProducts]
        }
      }
    }

    // Home Depot scraping (using a general product API)
    if (store === 'homedepot' || !store) {
      scraperName = store ? 'Home Depot Scraper' : 'Multi-Store Scraper'
      // Using a general product API for Home Depot-style products
      const homeDepotResponse = await fetch('https://api.scrapfly.io/scrape', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
        }
      })

      // Add some sample Home Depot products for now
      const homeDepotProducts = [
        {
          name: 'DEWALT 20V MAX Cordless Drill',
          description: 'Powerful cordless drill for home improvement projects',
          price: 129.99,
          category: 'Tools',
          image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
          affiliate_url: 'https://homedepot.com/product/123',
          store: 'Home Depot',
          external_id: 'HD123',
          rating: 4.5,
          reviews: 234,
          availability: 'In Stock'
        },
        {
          name: 'Ryobi Circular Saw',
          description: 'Professional grade circular saw for cutting wood',
          price: 89.99,
          category: 'Tools',
          image_url: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de',
          affiliate_url: 'https://homedepot.com/product/456',
          store: 'Home Depot',
          external_id: 'HD456',
          rating: 4.3,
          reviews: 156,
          availability: 'In Stock'
        }
      ]
      products = [...products, ...homeDepotProducts]
    }

    // Save products to database
    if (products.length > 0) {
      const { error: insertError } = await supabase
        .from('products')
        .upsert(products.map(product => ({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image_url: product.image_url,
          affiliate_url: product.affiliate_url,
          status: 'active'
        })), { onConflict: 'name' })

      if (insertError) {
        console.error('Error saving products:', insertError)
      }

      // Log scraping activity
      await supabase
        .from('scraper_logs')
        .insert({
          scraper_name: scraperName,
          status: 'success',
          message: `Successfully scraped ${products.length} products`,
          products_scraped: products.length
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: products,
        count: products.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Scraping error:', error)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('scraper_logs')
      .insert({
        scraper_name: 'Product Scraper',
        status: 'error',
        message: `Scraping failed: ${error.message}`,
        products_scraped: 0
      })

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
