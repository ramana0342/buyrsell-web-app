import crypto from "crypto";
import cloudinary from "../../utils/cloudinary.js";
import * as ProductModel from "../../models/seller_models/productModels.js";
import slugify from "slugify";

export const uploadImage = (buffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {

                folder: "BuyRSell-Mart/Products"

            },

            (error, result) => {

                if (error) {

                    reject(error);

                }

                else {

                    resolve(result);

                }

            }

        );

        stream.end(buffer);

    });

};

export const createProduct = async (req, res) => {

    try {



        const sellerId = req.seller.sellerId;

        const productId = crypto.randomUUID();

        const {

            categoryId,

            productName,

            shortDescription,

            description,

            brand,

            sku,

            sellingPrice,

            originalPrice,

            discountPercentage,

            gstPercentage,

            stockQuantity,

            minimumStockAlert,

            productStatus,

            featured

        } = req.body;

        const price = Number(sellingPrice);
        const stock = Number(stockQuantity || 0);
        const discount = Number(discountPercentage || 0);
        const gst = Number(gstPercentage || 0);
        if (!productName?.trim() || !categoryId || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(discount) || discount < 0 || discount > 100 || !Number.isFinite(gst) || gst < 0 || gst > 100) {
            return res.status(400).json({ status: { success: false, message: "Provide a product name, category, positive price, non-negative stock, and valid percentage values." } });
        }


        const slug =
            slugify(productName, {
                lower: true,
                strict: true
            }) +
            "-" +
            productId.substring(0, 8);

        const productUrl =
            `${process.env.FRONTEND_URL}/product/${slug}`;

        await ProductModel.createProduct({

            productId,

            sellerId,

            categoryId,

            productName,

            slug,

            productUrl,

            shortDescription,

            description,

            brand,

            sku: sku === "" ? null : sku,

            sellingPrice,

            originalPrice: originalPrice || null,

            discountPercentage: discountPercentage || 0,

            gstPercentage: gstPercentage || 0,

            stockQuantity: stockQuantity || 0,

            minimumStockAlert: minimumStockAlert || 5,

            product_status: productStatus ? "active" : "inactive",

            featured

        });

        if (req.files?.length) {

            let displayOrder = 1;

            for (const file of req.files) {

                const result = await uploadImage(file.buffer);

                await ProductModel.addProductImage({

                    imageId: crypto.randomUUID(),

                    productId,

                    imageUrl: result.secure_url,

                    publicId: result.public_id,

                    displayOrder

                });

                displayOrder++;

            }

        }

        return res.status(201).json({

            status: {

                success: true,

                message: "Product created successfully."

            }

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


export const getSellerProducts = async (req, res) => {

    try {

        const sellerId = req.seller.sellerId;
        const search = String(req.query.search || "").trim().slice(0, 100);
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
        const totalItems = await ProductModel.countSellerProducts(sellerId, search);
        const totalPages = Math.max(1, Math.ceil(totalItems / limit));
        const currentPage = Math.min(page, totalPages);
        const products = await ProductModel.getSellerProducts(sellerId, search, limit, (currentPage - 1) * limit);

        return res.status(200).json({

            status: {

                success: true,

                message: "Products fetched successfully."

            },

            response: products,
            pagination: { currentPage, pageSize: limit, totalItems, totalPages }

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

export const getSellerDashboardStats = async (req, res) => {
    try {
        const stats = await ProductModel.getSellerProductStats(req.seller.sellerId);
        return res.status(200).json({ status: { success: true }, response: stats });
    } catch (error) {
        console.error("Unable to load seller dashboard stats", error);
        return res.status(500).json({ status: { success: false, message: "Unable to load dashboard data." } });
    }
};

export const getProductById = async (req, res) => {

    try {

        const sellerId = req.seller.sellerId;

        const { productId } = req.params;

        const product = await ProductModel.getProductById(

            productId,

            sellerId

        );

        if (!product) {
            return res.status(404).json({ status: { success: false, message: "Product not found." } });
        }

        return res.status(200).json({

            status: {

                success: true

            },

            response: product

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


export const updateProduct = async (req, res) => {

    try {

        const sellerId = req.seller.sellerId;

        const { productId } = req.params;

        const {

            categoryId,

            productName,

            shortDescription,

            description,

            brand,

            sku,

            sellingPrice,

            originalPrice,

            discountPercentage,

            gstPercentage,

            stockQuantity,

            minimumStockAlert,

            productStatus,

            featured

        } = req.body;

        const price = Number(sellingPrice);
        const stock = Number(stockQuantity);
        const discount = Number(discountPercentage || 0);
        const gst = Number(gstPercentage || 0);
        if (!productName?.trim() || !categoryId || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(discount) || discount < 0 || discount > 100 || !Number.isFinite(gst) || gst < 0 || gst > 100) {
            return res.status(400).json({ status: { success: false, message: "Provide a product name, category, positive price, non-negative stock, and valid percentage values." } });
        }

        const updated = await ProductModel.updateProduct(

            productId,

            sellerId,

            {

                categoryId,

                productName,

                shortDescription,

                description,

                brand,

                sku: sku === "" ? null : sku,

                sellingPrice,

                originalPrice,

                discountPercentage,

                gstPercentage,

                stockQuantity,

                minimumStockAlert,

                productStatus: productStatus === true || productStatus === "true" || productStatus === "active" ? "active" : "inactive",

                featured

            }

        );

        if (!updated) {
            return res.status(404).json({ status: { success: false, message: "Product not found." } });
        }



        // Upload newly selected images

        if (req.files?.length) {

            let displayOrder = 1;

            for (const file of req.files) {

                const result = await uploadImage(

                    file.buffer

                );

                await ProductModel.addProductImage({

                    imageId: crypto.randomUUID(),

                    productId,

                    imageUrl: result.secure_url,

                    publicId: result.public_id,

                    displayOrder

                });

                displayOrder++;

            }

        }

        return res.status(200).json({

            status: {

                success: true,

                message: "Product updated successfully."

            }

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

export const deleteProduct = async (req, res) => {

    try {

        const sellerId = req.seller.sellerId;


        const { productId } = req.params;



        // Get Images

        const product = await ProductModel.getProductById(

            productId,

            sellerId

        );

        if (!product) {
            return res.status(404).json({ status: { success: false, message: "Product not found." } });
        }

        const result = await ProductModel.deleteProduct(productId, sellerId);
        if (result.notFound) {
            return res.status(404).json({ status: { success: false, message: "Product not found." } });
        }
        if (result.referenced) {
            return res.status(409).json({ status: { success: false, message: "This product is in a customer cart or wishlist and cannot be removed yet." } });
        }

        for (const image of product.images) {
            if (image.public_id) {
                try { await cloudinary.uploader.destroy(image.public_id); }
                catch (imageError) { console.error("Unable to remove product image from Cloudinary", imageError); }
            }
        }



        return res.status(200).json({

            status: {

                success: true,

                message: "Product deleted successfully."

            }

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

