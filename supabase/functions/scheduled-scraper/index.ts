
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

    console.log('Starting scheduled scraping...')

    // Categories to scrape
    const categories = ['electronics', 'home-garden', 'tools', 'clothing', 'sports']
    const stores = ['amazon', 'walmart', 'homedepot']

    for (const category of categories) {
      for (const store of stores) {
        try {
          // Call the main scraper function
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-products`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              store: store,
              category: category,
              query: category
            })
          })

          if (response.ok) {
            const data = await response.json()
            console.log(`Scraped ${data.count} products from ${store} in ${category}`)
          }

          // Wait between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`Error scraping ${store} for ${category}:`, error)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Scheduled scraping completed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Scheduled scraper error:', error)
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
