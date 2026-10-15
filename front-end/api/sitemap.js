module.exports = async function handler(req, res) {
    const apiBase = process.env.REACT_APP_API_URL || process.env.BACKEND_API_URL;
    if (!apiBase) return res.status(503).send("Sitemap API is not configured");
    try {
        const response = await fetch(`${apiBase.replace(/\/$/, "")}/sitemap.xml`, { headers: { Accept: "application/xml" } });
        const body = await response.text();
        res.setHeader("Content-Type", response.headers.get("content-type") || "application/xml; charset=utf-8");
        res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        return res.status(response.status).send(body);
    } catch (error) {
        console.error("Sitemap proxy failed", error);
        return res.status(502).send("Unable to retrieve sitemap");
    }
}
