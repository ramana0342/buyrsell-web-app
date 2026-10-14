import express from "express";

import {
    addToWishlist,
    removeFromWishlist,
    getCustomerWishlist,
    checkWishlist
} from "../../controllers/customer_controllers/customerWishlistController.js";

import {

    verifyCustomerJWT

} from "../../middlewares/verifyCustomerJWT.js";


const router = express.Router();


router.post(
    "/wishlist/:productId",
    verifyCustomerJWT,
    addToWishlist
);


router.delete(
    "/wishlist/:productId",
    verifyCustomerJWT,
    removeFromWishlist
);


router.get(
    "/wishlist",
    verifyCustomerJWT,
    getCustomerWishlist
);


router.get(
    "/wishlist/:productId",
    verifyCustomerJWT,
    checkWishlist
);


export default router;