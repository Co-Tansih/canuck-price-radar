// netlify/functions/search.js
const cheerio = require("cheerio");

// Main handler
exports.handler = async (event) => {
  try {
    const q = (event.queryStringParameters?.q || "").trim();
    if (!q) {
      return json(400, { error: "Missing query param ?q=" });
    }

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
    let items = parseAmazonSearch(html);

    // Fallback: if category-biased search returns nothing, try generic search
    if (items.length === 0) {
      const genericUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}`;
      const fallbackApi =
        `https://api.zenrows.com/v1/?apikey=${encodeURIComponent(process.env.ZENROWS_KEY)}` +
        `&url=${encodeURIComponent(genericUrl)}` +
        `&js_render=true&premium_proxy=true&wait_for=networkidle`;

      const alt = await fetch(fallbackApi);
      const altHtml = await alt.text();
      items = parseAmazonSearch(altHtml);
    }

    // Deduplicate & trim results
    const seen = new Set();
    const unique = items.filter(p => {
      if (seen.has(p.url)) return false;
      seen.add(p.url);
      return true;
    }).slice(0, 24);

    return json(200, { items: unique });
  } catch (err) {
    console.error("Server error:", err);
    return json(500, { error: "Server error", details: String(err) });
  }
};

// --- Helpers ---

function parseAmazonSearch(html) {
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
    const ratingText = $el.find(".a-icon-star-small .a-icon-alt").first().text().trim();
    const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : null;
    const reviewsText = $el.find('[aria-label$="ratings"]').first().attr("aria-label") || "";
    const reviews = reviewsText ? parseInt(reviewsText.replace(/[^\d]/g, ""), 10) : null;

    if (title && url && image) {
      items.push({
        id: url,
        title,
        price,
        image,
        url,
        rating,
        reviews,
      });
    }
  });

  return items;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // enable CORS
    },
    body: JSON.stringify(body),
  };
}
