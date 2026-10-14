import express from "express";

import {
    getCustomerCart,
    addProductToCart,
    updateCustomerCartQuantity,
    removeProductFromCart,
    clearCustomerCart
} from "../../controllers/customer_controllers/customerCartController.js";

import { verifyCustomerJWT } from "../../middlewares/verifyCustomerJWT.js";


const router = express.Router();


// Get Customer Cart
router.get("/cart",verifyCustomerJWT,getCustomerCart);


// Add Product To Cart
router.post("/cart",verifyCustomerJWT,addProductToCart);


// Update Cart Quantity
router.patch("/cart/:productId",verifyCustomerJWT,updateCustomerCartQuantity);



// Remove Product From Cart
router.delete("/cart/:productId",verifyCustomerJWT,removeProductFromCart);


// Clear Cart
router.delete("/cart/",verifyCustomerJWT,clearCustomerCart);




export default router;


