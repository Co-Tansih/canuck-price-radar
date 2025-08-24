// netlify/functions/search.js
const cheerio = require("cheerio");

exports.handler = async (event) => {
  try {
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
