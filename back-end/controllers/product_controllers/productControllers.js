import * as ProductModel from "../../models/product_models/productModels.js";

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
