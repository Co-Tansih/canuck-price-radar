// netlify/functions/search.js
// Purpose: Scrape Amazon.ca search results for a query using ZenRows + Cheerio
// Returns clean JSON for the frontend with proper error handling

const cheerio = require("cheerio");

exports.handler = async (event) => {
  try {
    const q = (event.queryStringParameters?.q || "").trim();
    if (!q) return json(400, { error: "Missing query param 'q'" });

    if (!process.env.ZENROWS_KEY) {
      console.error("ZENROWS_KEY missing from environment");
      return json(500, { error: "Server not configured (ZENROWS_KEY missing)" });
    }

    // Try hardware category first for better tool results
    const amazonSearch = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}&i=tools`;

    // ZenRows request with proper error handling
    const apiUrl =
      `https://api.zenrows.com/v1/` +
      `?apikey=${encodeURIComponent(process.env.ZENROWS_KEY)}` +
      `&url=${encodeURIComponent(amazonSearch)}` +
      `&js_render=true&premium_proxy=true&wait_for=networkidle`;

    console.log(`Searching for: "${q}" on Amazon.ca`);
    
    const zrRes = await fetch(apiUrl);
    const html = await zrRes.text();

    if (!zrRes.ok) {
      console.error("ZenRows error:", zrRes.status, html.slice(0, 500));
      return json(502, { error: "ZenRows error", status: zrRes.status, details: html.slice(0, 500) });
    }

    // Parse with Cheerio
    const $ = cheerio.load(html);
    const items = [];

    $('[data-component-type="s-search-result"]').each((_, el) => {
      const $el = $(el);

      // Skip sponsored results
      const sponsored =
        $el.find('[aria-label="Sponsored"]').length > 0 ||
        $el.find('.s-sponsored-label-text').length > 0;
      if (sponsored) return;

      const title = $el.find("h2 a span").text().trim();
      const rel = $el.find("h2 a").attr("href") || "";
      const url = rel.startsWith("http") ? rel : `https://www.amazon.ca${rel}`;
      const image =
        $el.find("img.s-image").attr("src") ||
        $el.find("img.s-image").attr("data-src") ||
        "";
      const price =
        $el.find(".a-price .a-offscreen").first().text().trim() ||
        $el.find(".a-price-whole").first().text().trim();
      
      // Extract rating and reviews
      const ratingText = $el.find('.a-icon-star-small .a-icon-alt').first().text().trim();
      const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : null;
      const reviewsText = $el.find('[aria-label$="ratings"]').first().attr('aria-label') || "";
      const reviews = reviewsText ? parseInt(reviewsText.replace(/[^\d]/g, ""), 10) : null;

      if (title && url && image) {
        const id = url; // Use URL as stable ID
        items.push({ 
          id, 
          title, 
          price, 
          image, 
          url, 
          rating: rating || 0, 
          reviews: reviews || 0,
          category: "Tools & Home Improvement"
        });
      }
    });

    // Fallback: if category-biased search returns nothing, try generic search
    if (items.length === 0) {
      console.log("No results from tools category, trying generic search");
      const genericUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}`;
      const fallbackApi =
        `https://api.zenrows.com/v1/` +
        `?apikey=${encodeURIComponent(process.env.ZENROWS_KEY)}` +
        `&url=${encodeURIComponent(genericUrl)}` +
        `&js_render=true&premium_proxy=true&wait_for=networkidle`;
      
      const altRes = await fetch(fallbackApi);
      const altHtml = await altRes.text();
      
      if (altRes.ok) {
        const $$ = cheerio.load(altHtml);
        $$('[data-component-type="s-search-result"]').each((_, el) => {
          const $el = $$(el);
          const title = $el.find("h2 a span").text().trim();
          const rel = $el.find("h2 a").attr("href") || "";
          const url = rel.startsWith("http") ? rel : `https://www.amazon.ca${rel}`;
          const image =
            $el.find("img.s-image").attr("src") ||
            $el.find("img.s-image").attr("data-src") ||
            "";
          const price =
            $el.find(".a-price .a-offscreen").first().text().trim() ||
            $el.find(".a-price-whole").first().text().trim();
          
          if (title && url && image) {
            const id = url;
            items.push({ id, title, price, image, url, rating: 0, reviews: 0 });
          }
        });
      }
    }

    // Deduplicate and limit results
    const seen = new Set();
    const unique = items.filter(p => {
      const k = p.url;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 24);

    console.log(`Found ${unique.length} products for query: "${q}"`);

    return json(200, { 
      items: unique, 
      count: unique.length, 
      query: q,
      source: "Amazon.ca"
    });
  } catch (err) {
    console.error("Search function error:", err);
    return json(500, { error: "Internal server error", details: String(err) });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
    body: JSON.stringify(body),
  };
}