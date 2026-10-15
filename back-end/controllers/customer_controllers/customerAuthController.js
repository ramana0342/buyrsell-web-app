import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { customerId } from "../../utils/idGenerator.js";

import {
    createCustomer,
    findCustomerByEmail,
    findCustomerById,
    verifyCustomerEmail,
    updateCustomerPassword
} from "../../models/customer_models/customerAuthModel.js";

import {
    refreshCookieOptions,
    refreshCookieOptionsRemove
} from "../../config/cookie.js";


import otpStore from "../../utils/otpStore.js";

import passwordResetOtpStore
    from "../../utils/passwordResetOtpStore.js";


import { generateOtp } from "../../utils/otpGenerator.js";

import { commonEmailSender } from "../../config/mailer.js";

import { customerOtpEmailTemplate } from "../../htmlTemplate/customerOtpEmailTemplate.js";

import {
    customerPasswordResetOtpEmailTemplate
} from "../../htmlTemplate/customerPasswordResetOtpEmailTemplate.js";

export const registerCustomer = async (req, res) => {

    try {

        let {

            fullName,
            email,
            password

        } = req.body;

        email = email.trim().toLowerCase();

        if (

            !fullName ||
            !email ||
            !password

        ) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "All fields are required"
                },

                response: null

            });

        }

        if (password.length < 8) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Password must be at least 8 characters."
                },

                response: null

            });

        }

        const existingCustomer = await findCustomerByEmail(email);

        if (existingCustomer) {

            return res.status(409).json({

                status: {
                    code: 409,
                    message: "Email already registered"
                },

                response: null

            });

        }

        const passwordHash = await bcrypt.hash(password, 10);

        const customer = {

            customer_id: customerId(),

            full_name: fullName,

            email,

            password_hash: passwordHash

        };

        const result = await createCustomer(customer);

        const accessToken = jwt.sign(

            {

                customerId: result.customer_id,

                email: result.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "10m"

            }

        );

        const refreshToken = jwt.sign(

            {

                customerId: result.customer_id,

                email: result.email

            },

            process.env.REFRESH_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.cookie(

            "customerRefreshToken",

            refreshToken,

            refreshCookieOptions

        );

        return res.status(201).json({

            status: {

                code: 201,

                message: "Registration successful"

            },

            response: {

                accessToken,

                customer: {

                    customer_id: result.customer_id,

                    full_name: result.full_name,

                    email: result.email,

                    email_verified: result.email_verified,

                    customer_status: result.customer_status

                }

            }

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {

                code: 500,

                message: error.message

            },

            response: null

        });

    }

};

export const loginCustomer = async (req, res) => {

    try {

        let {

            email,
            password

        } = req.body;

        email = email.trim().toLowerCase();

        if (

            !email ||
            !password

        ) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Email and password are required"
                },

                response: null

            });

        }

        const customer = await findCustomerByEmail(email);

        if (!customer) {

            return res.status(404).json({

                status: {
                    code: 404,
                    message: "Customer not found"
                },

                response: null

            });

        }

        const isPasswordMatched = await bcrypt.compare(

            password,

            customer.password_hash

        );

        if (!isPasswordMatched) {

            return res.status(401).json({

                status: {
                    code: 401,
                    message: "Invalid email or password"
                },

                response: null

            });

        }

        if (customer.customer_status !== "active") {

            return res.status(403).json({

                status: {
                    code: 403,
                    message: "Your account is not active"
                },

                response: null

            });

        }

        const accessToken = jwt.sign(

            {

                customerId: customer.customer_id,

                email: customer.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "10m"

            }

        );

        const refreshToken = jwt.sign(

            {

                customerId: customer.customer_id,

                email: customer.email

            },

            process.env.REFRESH_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.cookie(

            "customerRefreshToken",

            refreshToken,

            refreshCookieOptions

        );

        return res.status(200).json({

            status: {
                code: 200,
                message: "Login successful"
            },

            response: {

                accessToken,

                customer: {

                    customer_id: customer.customer_id,

                    full_name: customer.full_name,

                    email: customer.email,

                    email_verified: customer.email_verified,

                    customer_status: customer.customer_status

                }

            }

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {

                code: 500,

                message: error.message

            },

            response: null

        });

    }

};


export const sendEmailOtp = async (req, res) => {

    try {

        const customerId = req.customer.customerId;

        if (!customerId) {

            return res.status(400).json({

                status: {

                    code: 400,

                    message: "Customer authentication required"

                },

                response: null

            });

        }

        const customer = await findCustomerById(customerId);

        if (!customer) {

            return res.status(404).json({

                status: {

                    code: 404,

                    message: "Customer not found"

                },

                response: null

            });

        }

        if (customer.email_verified) {

            return res.status(409).json({

                status: {

                    code: 409,

                    message: "Email already verified"

                },

                response: null

            });

        }

        if (otpStore.has(customer.email)) {

            return res.status(429).json({

                status: {

                    code: 429,

                    message: "OTP already sent. Please wait before requesting another."

                },

                response: null

            });

        }

        const otp = generateOtp();

        otpStore.set(

            customer.email,

            otp

        );

        await commonEmailSender({

            to: customer.email,

            subject: "Verify Your Email",

            html: customerOtpEmailTemplate(otp)

        });

        return res.status(200).json({

            status: {

                code: 200,

                message: "OTP sent successfully"

            },

            response: null

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {

                code: 500,

                message: error.message

            },

            response: null

        });

    }

};


export const verifyEmailOtp = async (req, res) => {

    try {

        const { otp } = req.body;

        const customerId = req.customer.customerId;

        if (

            !customerId ||
            !otp

        ) {

            return res.status(400).json({

                status: {

                    code: 400,

                    message: "OTP is required"

                },

                response: null

            });

        }

        const customer = await findCustomerById(customerId);

        if (!customer) {

            return res.status(404).json({

                status: {

                    code: 404,

                    message: "Customer not found"

                },

                response: null

            });

        }

        if (customer.email_verified) {

            return res.status(409).json({

                status: {

                    code: 409,

                    message: "Email already verified"

                },

                response: null

            });

        }

        const storedOtp = otpStore.get(customer.email);

        if (!storedOtp) {

            return res.status(400).json({

                status: {

                    code: 400,

                    message: "OTP expired. Please request a new OTP."

                },

                response: null

            });

        }

        if (storedOtp !== otp) {

            return res.status(400).json({

                status: {

                    code: 400,

                    message: "Invalid OTP"

                },

                response: null

            });

        }

        otpStore.del(customer.email);

        const updatedCustomer = await verifyCustomerEmail(
            customer.customer_id
        );

        return res.status(200).json({

            status: {

                code: 200,

                message: "Email verified successfully"

            },

            response: {

                customer: {

                    customer_id: updatedCustomer.customer_id,

                    full_name: updatedCustomer.full_name,

                    email: updatedCustomer.email,

                    email_verified: updatedCustomer.email_verified,

                    customer_status: updatedCustomer.customer_status

                }

            }

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {

                code: 500,

                message: error.message

            },

            response: null

        });

    }

};

export const resendEmailOtp = async (req, res) => {

    const customerId = req.customer.customerId;

    const customer = await findCustomerById(customerId);

    otpStore.del(customer.email);

    return sendEmailOtp(req, res);

};


export const logoutCustomer = async (req, res) => {

    res.clearCookie(

        "customerRefreshToken",

        refreshCookieOptionsRemove

    );

    return res.status(200).json({

        status: {

            code: 200,

            message: "Logout successful"

        },

        response: null

    });

};


export const sendPasswordResetOtp = async (
    req,
    res
) => {

    try {

        let { email } = req.body;

        if (!email) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Email is required"
                },

                response: null

            });

        }

        email = email.trim().toLowerCase();

        const customer =
            await findCustomerByEmail(email);

        /*
         * Do not reveal whether the email exists.
         *
         * This prevents someone from using the
         * forgot-password endpoint to discover
         * registered customer emails.
         */

        if (!customer) {

            return res.status(200).json({

                status: {
                    code: 200,
                    message:
                        "If an account exists with this email, an OTP has been sent."
                },

                response: null

            });

        }

        if (
            passwordResetOtpStore.has(email)
        ) {

            return res.status(429).json({

                status: {
                    code: 429,
                    message:
                        "OTP already sent. Please wait before requesting another."
                },

                response: null

            });

        }

        const otp = generateOtp();

        passwordResetOtpStore.set(
            email,
            {
                otp,
                customerId: customer.customer_id
            }
        );

        await commonEmailSender({

            to: customer.email,

            subject:
                "Reset Your buyRsell Mart Password",

            html:
                customerPasswordResetOtpEmailTemplate(
                    otp
                )

        });

        return res.status(200).json({

            status: {
                code: 200,
                message:
                    "If an account exists with this email, an OTP has been sent."
            },

            response: null

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {
                code: 500,
                message: error.message
            },

            response: null

        });

    }

};

export const verifyPasswordResetOtp = async (
    req,
    res
) => {

    try {

        let { email, otp } = req.body;

        if (!email || !otp) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message:
                        "Email and OTP are required"
                },

                response: null

            });

        }

        email = email.trim().toLowerCase();

        const storedData =
            passwordResetOtpStore.get(email);

        if (!storedData) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message:
                        "OTP expired. Please request a new OTP."
                },

                response: null

            });

        }

        if (
            storedData.otp !== otp
        ) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Invalid OTP"
                },

                response: null

            });

        }

        /*
         * OTP is correct.
         *
         * Remove it so it cannot be reused.
         */

        passwordResetOtpStore.del(email);

        const resetToken = jwt.sign(

            {
                customerId:
                    storedData.customerId,

                email

            },

            process.env.PASSWORD_RESET_SECRET,

            {
                expiresIn: "10m"
            }

        );

        return res.status(200).json({

            status: {

                code: 200,

                message:
                    "OTP verified successfully"

            },

            response: {

                resetToken,

                email

            }

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {
                code: 500,
                message: error.message
            },

            response: null

        });

    }

};

export const resetCustomerPassword = async (
    req,
    res
) => {

    try {

        const {
            email,
            password,
            resetToken
        } = req.body;

        if (
            !email ||
            !password ||
            !resetToken
        ) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message:
                        "Email, password and reset token are required"
                },

                response: null

            });

        }

        if (password.length < 8) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message:
                        "Password must be at least 8 characters."
                },

                response: null

            });

        }

        let decoded;

        try {

            decoded = jwt.verify(
                resetToken,
                process.env.PASSWORD_RESET_SECRET
            );

        }
        catch {

            return res.status(401).json({

                status: {
                    code: 401,
                    message:
                        "Password reset session expired. Please start again."
                },

                response: null

            });

        }

        const normalizedEmail =
            email.trim().toLowerCase();

        if (
            decoded.email !== normalizedEmail
        ) {

            return res.status(401).json({

                status: {
                    code: 401,
                    message:
                        "Invalid password reset request"
                },

                response: null

            });

        }

        const customer =
            await findCustomerById(
                decoded.customerId
            );

        if (!customer) {

            return res.status(404).json({

                status: {
                    code: 404,
                    message:
                        "Customer not found"
                },

                response: null

            });

        }

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        await updateCustomerPassword(
            customer.customer_id,
            passwordHash
        );

        /*
         * Invalidate existing refresh token.
         *
         * Since your current refresh-token system is
         * stateless JWT, this requires a token-version/
         * blacklist strategy if you want immediate
         * invalidation of every existing session.
         */

        return res.status(200).json({

            status: {
                code: 200,
                message:
                    "Password reset successfully"
            },

            response: null

        });

    }
    catch (error) {

        return res.status(500).json({

            status: {
                code: 500,
                message: error.message
            },

            response: null

        });

    }

};
