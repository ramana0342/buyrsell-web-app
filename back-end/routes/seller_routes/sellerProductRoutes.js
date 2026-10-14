import express from "express";

const router = express.Router();

import { upload } from "../../utils/upload.js"

import { authenticateSeller } from "../../middlewares/authenticateSeller.js"

import {
    createProduct,
    getSellerProducts,
    getSellerDashboardStats,
    getProductById,
    updateProduct,
    deleteProduct
} from "../../controllers/seller_controllers/sellerProductsController.js";

// Create Product
router.post("/seller/products", authenticateSeller, upload.array("images", 5), createProduct);

// Seller Products
router.get("/seller/dashboard/stats", authenticateSeller, getSellerDashboardStats);
router.get("/seller/products", authenticateSeller, getSellerProducts);

// Single Product
router.get("/seller/products/:productId", authenticateSeller, getProductById);

// Update Product
router.patch("/seller/products/:productId", authenticateSeller, upload.array("images", 5), updateProduct);

// Delete Product
router.delete("/seller/products/:productId", authenticateSeller, deleteProduct);

export default router; 
