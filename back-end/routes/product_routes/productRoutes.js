import express from "express";
import {
    getAllProducts,
    getProductDetails
} from "../../controllers/product_controllers/productControllers.js";
const router = express.Router();

router.get("/products", getAllProducts);

router.get("/products/:slug", getProductDetails);

export default router;