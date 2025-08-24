// netlify/functions/health.js
// Health check endpoint to verify environment configuration

exports.handler = async (event) => {
  try {
    const hasZenRows = !!process.env.ZENROWS_KEY;
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ok: true,
        env: hasZenRows,
        timestamp: new Date().toISOString(),
        message: hasZenRows ? "All environment variables configured" : "Missing ZENROWS_KEY"
      })
    };
  } catch (error) {
    console.error("Health check error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ok: false,
        env: false,
        error: "Health check failed"
      })
    };
  }
};