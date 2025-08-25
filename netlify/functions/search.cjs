// netlify/functions/search.js
// Serverless function: scrape Amazon.ca search results via ZenRows and return normalized JSON
const cheerio = require("cheerio");

/**
 * Use `globalThis.fetch` when available (Netlify runtime / modern Node).
 * Fallback: dynamic import of node-fetch for local dev (only if needed).
 */
async function doFetch(url, opts) {
  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch(url, opts);
  }
  // dynamic import to avoid breaking ESM/CJS runtime on Netlify
  const nf = await import("node-fetch");
  const fetchFn = nf.default || nf;
  return fetchFn(url, opts);
}

exports.handler = async (event) => {
  try {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return json(204, null);
    }

    const q = (event.queryStringParameters?.q || "").trim();
    if (!q) return json(400, { error: "Missing query param ?q=" });

    const ZENROWS_KEY = process.env.ZENROWS_KEY || process.env.VITE_ZENROWS_KEY || process.env.ZENROWS_API_KEY;
    if (!ZENROWS_KEY) {
      console.error("ZENROWS_KEY missing from environment (checked: ZENROWS_KEY, VITE_ZENROWS_KEY, ZENROWS_API_KEY)");
      return json(500, { error: "Server misconfigured: ZENROWS_KEY not set" });
    }

    // First try a tools/category-biased search (more relevant for hardware)
    const toolsUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}&i=tools`;
    let html = await fetchZenRows(toolsUrl, ZENROWS_KEY);
    let items = parseAmazonSearch(html);

    // If nothing found, try generic search (fallback)
    if (!items || items.length === 0) {
      const genericUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(q)}`;
      const html2 = await fetchZenRows(genericUrl, ZENROWS_KEY);
      items = parseAmazonSearch(html2);
    }

    // Deduplicate and cap results
    const seen = new Set();
    const unique = (items || []).filter((p) => {
      if (!p || !p.url) return false;
      if (seen.has(p.url)) return false;
      seen.add(p.url);
      return true;
    }).slice(0, 24);

    return json(200, { items: unique, count: unique.length, query: q });
  } catch (err) {
    console.error("search.js server error:", err);
    return json(500, { error: "Internal server error", details: String(err).slice(0, 500) });
  }
};

// --- helper: call ZenRows and return HTML (throws on non-OK) ---
async function fetchZenRows(targetUrl, apiKey) {
  const apiUrl =
    `https://api.zenrows.com/v1/` +
    `?apikey=${encodeURIComponent(apiKey)}` +
    `&url=${encodeURIComponent(targetUrl)}` +
    `&js_render=true&premium_proxy=true&wait_for=networkidle`;

  const res = await doFetch(apiUrl, { method: "GET" });
  const text = await res.text();
  if (!res.ok) {
    // include short excerpt to help debugging
    const snippet = (text && text.slice) ? text.slice(0, 500) : String(text);
    throw new Error(`ZenRows request failed: ${res.status} ${snippet}`);
  }
  return text;
}

// --- helper: parse Amazon search HTML into items array ---
function parseAmazonSearch(html) {
  if (!html || typeof html !== "string") return [];

  const $ = cheerio.load(html);
  const items = [];

  // Amazon search result cards
  $('[data-component-type="s-search-result"]').each((_, el) => {
    const $el = $(el);

    // Skip obvious sponsored results
    const sponsored =
      $el.find('[aria-label="Sponsored"]').length > 0 ||
      $el.find('.s-sponsored-label-text').length > 0 ||
      $el.find('.s-label-popover-default').length > 0;
    if (sponsored) return;

    // Title
    const title = $el.find('h2 a span').first().text().trim();

    // URL (relative or absolute)
    let rel = $el.find('h2 a').attr('href') || '';
    if (!rel) {
      rel = $el.find('a.a-link-normal').attr('href') || '';
    }
    const url = rel.startsWith('http') ? rel : `https://www.amazon.ca${rel}`;

    // Image: try multiple attributes
    const image =
      $el.find('img.s-image').attr('src') ||
      $el.find('img.s-image').attr('data-src') ||
      $el.find('img.s-image').attr('data-lazy') ||
      $el.find('img.s-image').attr('data-image-lazy') ||
      '';

    // Price: prefer .a-offscreen (full price string), else build from whole + fraction
    let price = $el.find('.a-price .a-offscreen').first().text().trim();
    if (!price) {
      const whole = $el.find('.a-price-whole').first().text().replace(/[^\d]/g, '').trim();
      const frac = $el.find('.a-price-fraction').first().text().replace(/[^\d]/g, '').trim();
      if (whole) price = frac ? `${whole}.${frac}` : whole;
    }
    // Rating (e.g., "4.7 out of 5 stars")
    const ratingText = $el.find('.a-icon-alt').first().text().trim();
    const rating = ratingText ? parseFloat((ratingText.split(' ')[0] || '').replace(',', '.')) : null;

    // Reviews count - try aria-labels or text nodes
    let reviews = null;
    const reviewsLabel = $el.find('[aria-label*="rating"], [aria-label$="ratings"], .a-size-base').first();
    if (reviewsLabel && reviewsLabel.attr && reviewsLabel.attr('aria-label')) {
      reviews = parseInt(reviewsLabel.attr('aria-label').replace(/[^\d]/g, ''), 10);
    } else {
      // fallback: look for numeric text in .a-size-base that looks like review counts
      const revText = $el.find('.a-size-base').filter(function() {
        const t = $(this).text().replace(/[, ]/g, '').trim();
        return /^\d{1,6}$/.test(t);
      }).first().text().trim();
      if (revText) reviews = parseInt(revText.replace(/[^\d]/g, ''), 10);
    }

    // push when we have at least title + url (image/price optional)
    if (title && url) {
      items.push({
        id: url,
        title,
        price: price || null,
        image: image || null,
        url,
        rating: Number.isFinite(rating) ? rating : null,
        reviews: Number.isFinite(reviews) ? reviews : null,
      });
    }
  });

  return items;
}

// --- helper: JSON response with CORS headers ---
function json(statusCode, body) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  return {
    statusCode,
    headers,
    body: body === null ? "" : JSON.stringify(body),
  };
}
