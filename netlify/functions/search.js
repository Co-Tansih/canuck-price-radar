// netlify/functions/search.js
<<<<<<< HEAD
=======
// Purpose: Scrape Amazon.ca "Tools & Home Improvement" results for a query.
// Uses ZenRows (env: ZENROWS_KEY) + Cheerio to return clean JSON for the frontend.

>>>>>>> 75a9784a9d92d3c254cdd323863fd993a12ab224
const cheerio = require("cheerio");

exports.handler = async (event) => {
  try {
<<<<<<< HEAD
    const q = event.queryStringParameters.q;
    if (!q) {
      return response(400, { error: "Missing query param ?q=" });
    }

    // Target Amazon.ca (change domain if needed)
    const targetUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}`;

    // Build ZenRows request
    const apiUrl =
      `https://api.zenrows.com/v1/?apikey=${process.env.ZENROWS_KEY}` +
      `&url=${encodeURIComponent(targetUrl)}` +
      `&js_render=true&premium_proxy=true`;

    const res = await fetch(apiUrl);
    const html = await res.text();

    // Parse with Cheerio
    const $ = cheerio.load(html);
    const products = [];

    $('[data-component-type="s-search-result"]').each((_, el) => {
      const title = $(el).find("h2 a span").text().trim();
      const price = $(el).find(".a-price .a-offscreen").first().text().trim();
      const image = $(el).find("img.s-image").attr("src");
      const url =
        "https://www.amazon.ca" + ($(el).find("h2 a").attr("href") || "");

      if (title && image && url) {
        products.push({ title, price, image, url });
      }
    });

    return response(200, { items: products });
  } catch (err) {
    console.error(err);
    return response(500, { error: "Server error", details: String(err) });
  }
};

// Helper for JSON response
function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
=======
    const q = (event.queryStringParameters?.q || "").trim();
    if (!q) return json(400, { error: "Missing query param ?q=" });

    // Prefer hardware category by adding i=tools (Amazon category bias)
    const amazonSearch = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}&i=tools`;

    // ZenRows request (server-side only; key is in Netlify env)
    const apiUrl =
      `https://api.zenrows.com/v1/?apikey=${encodeURIComponent(process.env.ZENROWS_KEY)}` +
      `&url=${encodeURIComponent(amazonSearch)}` +
      `&js_render=true&premium_proxy=true&wait_for=networkidle`;

    const zrRes = await fetch(apiUrl);
    if (!zrRes.ok) {
      const text = await zrRes.text();
      return json(502, { error: "ZenRows error", details: text.slice(0, 500) });
    }
    const html = await zrRes.text();

    // Parse
    const $ = cheerio.load(html);
    const items = [];

    $('[data-component-type="s-search-result"]').each((_, el) => {
      const $el = $(el);

      // Skip sponsored if label exists
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
      const ratingText = $el.find('.a-icon-star-small .a-icon-alt').first().text().trim();
      const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : null;
      const reviewsText = $el.find('[aria-label$="ratings"]').first().attr('aria-label') || "";
      const reviews = reviewsText ? parseInt(reviewsText.replace(/[^\d]/g, ""), 10) : null;

      if (title && url && image) {
        const id = url; // stable id for UI keys
        items.push({ id, title, price, image, url, rating, reviews });
      }
    });

    // Fallback: if category-biased search returns nothing, try generic search
    const haveResults = items.length > 0;
    if (!haveResults) {
      const genericUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}`;
      const fallbackApi =
        `https://api.zenrows.com/v1/?apikey=${encodeURIComponent(process.env.ZENROWS_KEY)}` +
        `&url=${encodeURIComponent(genericUrl)}` +
        `&js_render=true&premium_proxy=true&wait_for=networkidle`;
      const alt = await fetch(fallbackApi);
      const altHtml = await alt.text();
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
          items.push({ id, title, price, image, url });
        }
      });
    }

    // Deduplicate & trim
    const seen = new Set();
    const unique = items.filter(p => {
      const k = p.url;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 24);

    return json(200, { items: unique });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Server error", details: String(err) });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  };
}
>>>>>>> 75a9784a9d92d3c254cdd323863fd993a12ab224
