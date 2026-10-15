import * as ProductModel from "../../models/product_models/productModels.js";

const xmlEscape = value => String(value).replace(/[<>&'\"]/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[char]);

export const getSitemap = async (req, res) => {
    try {
        const products = await ProductModel.getSitemapProducts();
        const publicPages = ["https://buyrsell.vercel.app/", "https://buyrsell.vercel.app/products", "https://buyrsell.vercel.app/products?featured=true", ...["electronics", "fashion", "home", "grocery"].map(category => `https://buyrsell.vercel.app/products?category=${category}`)];
        const urls = [...publicPages, ...products.map(product => `https://buyrsell.vercel.app/product/${encodeURIComponent(product.slug)}`)];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url, index) => {
            const product = products[index - publicPages.length];
            const lastmod = product?.updated_at ? `<lastmod>${new Date(product.updated_at).toISOString().slice(0, 10)}</lastmod>` : "";
            return `<url><loc>${xmlEscape(url)}</loc>${lastmod}</url>`;
        }).join("")}</urlset>`;
        res.type("application/xml").send(xml);
    } catch (error) {
        console.error("Sitemap generation failed", error);
        res.status(500).type("text/plain").send("Unable to generate sitemap");
    }
};

export const getAllProducts = async (req, res) => {

    try {

        const search = String(req.query.search || "").trim();
        const category = String(req.query.category || "").trim();
        const featured = req.query.featured === "true";
        const excludeFeatured = req.query.excludeFeatured === "true";
        if (req.query.homeCategories === "true") {
            const rows = await ProductModel.getHomepageCategoryProducts();
            const categories = rows.reduce((grouped, product) => {
                const key = product.category_id;
                if (!grouped[key]) grouped[key] = { category_id: key, category_name: product.category_name, total: Number(product.category_total), products: [] };
                grouped[key].products.push(product);
                return grouped;
            }, {});
            return res.status(200).json({ status: { success: true, message: "Homepage category products fetched successfully." }, response: Object.values(categories) });
        }
        const parsedLimit = Number.parseInt(req.query.limit, 10);
        const parsedOffset = Number.parseInt(req.query.offset, 10);
        if ((req.query.limit && (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100)) || (req.query.offset && (!Number.isInteger(parsedOffset) || parsedOffset < 0))) {
            return res.status(400).json({ status: { success: false, message: "Invalid pagination parameters." } });
        }
        const products = await ProductModel.getAllProducts({ search, category, featured, excludeFeatured, limit: parsedLimit || 100, offset: parsedOffset || 0 });

        return res.status(200).json({

            status: {
                success: true,
                message: "Products fetched successfully."
            },

            response: products,
            total: products.length ? Number(products[0].total_count) : 0

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            status: {
                success: false,
                message: "Internal Server Error"
            }

        });

    }

};


export const getProductDetails = async (req, res) => {

    try {

         const { slug } = req.params;

const data =
    await ProductModel.getPublicProductBySlug(slug);

        if (!data) {

            return res.status(404).json({

                status: {

                    success: false,

                    message: "Product not found"

                }

            });

        }

        return res.status(200).json({

            status: {

                success: true,

                message: "Product fetched successfully"

            },

            response: data

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            status: {

                success: false,

                message: "Internal Server Error"

            }

        });

    }

};
