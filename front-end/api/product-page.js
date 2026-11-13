const SITE_NAME = "buyRsell Mart";
const SITE_ORIGIN = "https://buyrsell.vercel.app";
const GLOBAL_STYLESHEETS = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">`;

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

const cleanText = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getApiBase = () => {
    // Keep server rendered product requests on the same local backend as the
    // browser API client when running `vercel dev`.
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:5000/buyrsell/api";
    }

    const value = process.env.REACT_APP_API_URL || process.env.BACKEND_API_URL;
    return value ? value.replace(/\/$/, "") : null;
};

const redactUrl = value => {
    try {
        const url = new URL(value);
        url.username = "";
        url.password = "";
        url.search = "";
        url.hash = "";
        return url.toString();
    } catch {
        return "[invalid URL]";
    }
};

const formatPrice = value => {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount.toLocaleString("en-IN") : "";
};

const PRODUCT_FIELDS = [
    "product_id", "product_name", "slug", "product_url", "short_description",
    "description", "brand", "sku", "selling_price", "original_price",
    "discount_percentage", "stock_quantity", "average_rating", "total_reviews",
    "product_status", "category_name", "business_name", "email", "phone"
];

const RELATED_PRODUCT_FIELDS = [
    "product_name", "slug", "image", "discount_percentage",
    "average_rating", "selling_price", "original_price"
];

const pickFields = (value, fields) => Object.fromEntries(
    fields.filter(field => value[field] !== undefined).map(field => [field, value[field]])
);

const toPublicProduct = product => ({
    ...pickFields(product, PRODUCT_FIELDS),
    images: (Array.isArray(product.images) ? product.images : []).map(image => pickFields(
        image,
        ["image_url", "display_order"]
    ))
});

// A semantic SEO snapshot is separate from the React product UI. It stays in
// the response for non-JavaScript clients and is hidden once the React app boots.
const renderProductPage = (product, price) => {
    const images = (Array.isArray(product.images) ? product.images : []).filter(item => item.image_url);
    return `<article><nav aria-label="Breadcrumb"><a href="/">Home</a>${product.category_name ? ` &rsaquo; <a href="/products?category=${encodeURIComponent(product.category_id || product.category_name)}">${escapeHtml(product.category_name)}</a>` : ""} &rsaquo; ${escapeHtml(product.product_name)}</nav><h1>${escapeHtml(product.product_name)}</h1>${product.brand ? `<p>Brand: ${escapeHtml(product.brand)}</p>` : ""}<p>Price: &#8377;${formatPrice(price)}</p>${product.original_price ? `<p>Original price: &#8377;${formatPrice(product.original_price)}</p>` : ""}<p>${escapeHtml(cleanText(product.short_description || product.description))}</p>${images.map((item, index) => `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(product.product_name)}${index ? ` image ${index + 1}` : ""}"${index ? " loading=\"lazy\"" : ""}>`).join("")}<p>${Number(product.stock_quantity) > 0 ? "In stock" : "Out of stock"}</p></article>`;
};

module.exports = async function handler(req, res) {
    const slug = String(req.query.slug || "").trim();
    const apiBase = getApiBase();
    if (!slug || !apiBase) return res.status(slug ? 503 : 404).send("Product page is unavailable");

    try {
        const requestedUrl = `${apiBase}/products/${encodeURIComponent(slug)}`;
        const response = await fetch(requestedUrl, {
            headers: { Accept: "application/json" }
        });
        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();
        let payload;
        try {
            payload = JSON.parse(responseText);
        } catch {
            console.warn("Product API returned a non-JSON response", {
                url: redactUrl(requestedUrl),
                status: response.status,
                contentType,
                preview: responseText.slice(0, 300)
            });
            return res.status(response.status === 404 ? 404 : 502).send("Unable to load product");
        }

        console.info("Product API response", {
            url: redactUrl(requestedUrl),
            status: response.status,
            contentType
        });
        if (!response.ok) return res.status(response.status === 404 ? 404 : 502).send("Product not found");
        const product = payload?.response?.product;
        if (!payload?.status?.success || !product || product.product_status !== "active") {
            return res.status(404).send("Product not found");
        }

        const canonical = `${SITE_ORIGIN}/product/${encodeURIComponent(product.slug || slug)}`;
        const title = `${cleanText(product.product_name)}${product.brand ? ` by ${cleanText(product.brand)}` : ""} | ${SITE_NAME}`;
        const description = (cleanText(product.short_description || product.description) || `${cleanText(product.product_name)} available on ${SITE_NAME}.`).slice(0, 160);
        const images = (Array.isArray(product.images) ? product.images : []).map(image => image.image_url).filter(Boolean);
        const image = images[0] || `${SITE_ORIGIN}/preview.png`;
        const price = Number(product.selling_price);
        const hasPrice = product.selling_price !== null && product.selling_price !== undefined && Number.isFinite(price);
        const requestOrigin = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers["x-forwarded-host"] || req.headers.host || new URL(SITE_ORIGIN).host}`;
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: cleanText(product.product_name),
            url: canonical,
            description,
            ...(images.length ? { image: images } : {}),
            ...(product.brand ? { brand: { "@type": "Brand", name: cleanText(product.brand) } } : {}),
            ...(hasPrice ? { offers: {
                "@type": "Offer", url: canonical, priceCurrency: "INR", price,
                availability: Number(product.stock_quantity) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            } } : {})
        };

        // CRA's asset manifest provides hashed bundles so this HTML stays compatible with each deployment build.
        let assets = { scripts: [], styles: [] };
        try {
            const manifestResponse = await fetch(`${requestOrigin}/asset-manifest.json`);
            if (manifestResponse.ok) {
                const manifest = await manifestResponse.json();
                assets = {
                    scripts: (manifest.entrypoints || []).filter(path => path.endsWith(".js")),
                    styles: (manifest.entrypoints || []).filter(path => path.endsWith(".css"))
                };
            }
        } catch (error) {
            console.error("Unable to load frontend asset manifest", error);
        }

        const serverProductMarkup = renderProductPage(product, price);
        const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>html.seo-app #seo-product-fallback{display:none!important}</style><script>document.documentElement.classList.add("seo-app")</script><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:type" content="product"><meta property="og:site_name" content="${SITE_NAME}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(image)}"><meta property="product:price:amount" content="${Number.isFinite(price) ? price : ""}"><meta property="product:price:currency" content="INR"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}"><script id="product-structured-data" type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>${GLOBAL_STYLESHEETS}${assets.styles.map(path => `<link rel="stylesheet" href="/${escapeHtml(path)}">`).join("")}</head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"><div id="seo-product-fallback">${serverProductMarkup}</div></div>${assets.scripts.map(path => `<script defer="defer" src="/${escapeHtml(path)}"></script>`).join("")}</body></html>`;

        const initialProductData = {
            slug: product.slug || slug,
            product: toPublicProduct(product),
            relatedProducts: Array.isArray(payload.response.relatedProducts)
                ? payload.response.relatedProducts.map(item => pickFields(item, RELATED_PRODUCT_FIELDS))
                : []
        };
        const serializedProductData = JSON.stringify(initialProductData).replace(/[<>&\u2028\u2029]/g, char => ({
            "<": "\\u003c", ">": "\\u003e", "&": "\\u0026",
            "\u2028": "\\u2028", "\u2029": "\\u2029"
        }[char]));
        const html = body.replace("</body>", `<script>window.__BUYRSELL_INITIAL_PRODUCT__=${serializedProductData};</script></body>`);

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large");
        return res.status(200).send(html);
    } catch (error) {
        console.error("Product page rendering failed", error);
        return res.status(502).send("Unable to load product");
    }
};
