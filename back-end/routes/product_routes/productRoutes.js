import express from "express";
import {
    getAllProducts,
    getProductDetails,
    getSitemap
} from "../../controllers/product_controllers/productControllers.js";
const router = express.Router();

router.get("/sitemap.xml", getSitemap);

router.get("/products", getAllProducts);

router.get("/products/:slug", getProductDetails);

export default router;
