import express from "express";

import {
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    sendEmailOtp,
    verifyEmailOtp,
    resendEmailOtp,
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetCustomerPassword
} from "../../controllers/customer_controllers/customerAuthController.js";


import {

    refreshTokenHandler

} from "../../controllers/customer_controllers/customerRefreshTokenHandler.js";


import {

    verifyCustomerJWT

} from "../../middlewares/verifyCustomerJWT.js";


const router = express.Router();


router.post("/register", registerCustomer);

router.post("/login", loginCustomer);

router.post("/logout", logoutCustomer);

router.post("/refresh-token", refreshTokenHandler);

router.post(

    "/send-email-otp",

    verifyCustomerJWT,

    sendEmailOtp

);

router.post(

    "/verify-email-otp",

    verifyCustomerJWT,

    verifyEmailOtp

);

router.post(

    "/resend-email-otp",

    verifyCustomerJWT,

    resendEmailOtp

);


router.post(
    "/forgot-password/send-otp",
    sendPasswordResetOtp
);

router.post(
    "/forgot-password/verify-otp",
    verifyPasswordResetOtp
);

router.post(
    "/forgot-password/reset",
    resetCustomerPassword
);

export default router;