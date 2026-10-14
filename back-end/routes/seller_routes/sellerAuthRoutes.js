import express from "express";

import {
    registerSeller,
    loginSeller,
    verifyEmail,
    resendVerificationEmail,
    forgotSellerPassword,
    resetSellerPassword
} from "../../controllers/seller_controllers/sellerAuthController.js";
import { refreshTokenHandler } from "../../controllers/seller_controllers/refreshTokenHandler.js"

const router = express.Router();

router.post("/register", registerSeller);

router.post("/login", loginSeller);

router.get("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerificationEmail);

router.post("/refresh-token", refreshTokenHandler);

router.post(
    "/forgot-password",
    forgotSellerPassword
);

router.post(
    "/reset-password",
    resetSellerPassword
);

export default router;