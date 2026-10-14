import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sellerId } from "../../utils/idGenerator.js";

import {
  createSeller,
  findSellerByEmail,
  findSellerByPhone,
  findSellerById,
  verifySellerEmail,
  updateSellerPassword
} from "../../models/seller_models/sellerAuthModel.js";

import { refreshCookieOptions } from "../../config/cookie.js";
import { commonEmailSender } from "../../config/mailer.js";
import { sellerVerificationEmailTemplate } from "../../htmlTemplate/sellerVerificationEmailTemplate.js";
import {
    sellerPasswordResetEmailTemplate
} from "../../htmlTemplate/sellerPasswordResetEmailTemplate.js";

export const registerSeller = async (req, res) => {

  try {

    const {
      businessName,
      fullName,
      email,
      phone,
      password
    } = req.body;

    if (
      !businessName ||
      !fullName ||
      !email ||
      !phone ||
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

    const existingEmail = await findSellerByEmail(email);

    if (existingEmail) {

      return res.status(409).json({
        status: {
          code: 409,
          message: "Email already registered"
        },
        response: null
      });

    }

    const existingPhone = await findSellerByPhone(phone);

    if (existingPhone) {

      return res.status(409).json({
        status: {
          code: 409,
          message: "Phone number already registered"
        },
        response: null
      });

    }

    const passwordHash = await bcrypt.hash(password, 10);

    const seller = {

      seller_id: sellerId(),

      business_name: businessName,

      owner_name: fullName,

      email,

      phone,

      password_hash: passwordHash

    };

    const result = await createSeller(seller);


    const verificationToken = jwt.sign(
      {
        sellerId: result.seller_id
      },
      process.env.EMAIL_VERIFICATION_SECRET,
      {
        expiresIn: "5m"
      }
    );

    const verificationLink =
      `${process.env.FRONTEND_URL}/seller/verify-email?token=${verificationToken}`;


    await commonEmailSender({

      to: result.email,

      subject: "Verify Your Seller Account",

      html: sellerVerificationEmailTemplate(verificationLink)
    });



    return res.status(201).json(

      {
        "status": {
          "code": 201,
          "message": "Registration successful. Please verify your email."
        },
        response: {

          seller: {

            seller_id: result.seller_id,

            business_name: result.business_name,

            owner_name: result.owner_name,

            email: result.email,

            phone: result.phone,

            email_verified: result.email_verified,

            seller_status: result.seller_status

          }

        }
      }

    );

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

export const loginSeller = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        status: {
          code: 400,
          message: "Email and password are required"
        },
        response: null
      });

    }

    const seller = await findSellerByEmail(email);

    if (!seller) {

      return res.status(404).json({
        status: {
          code: 404,
          message: "Seller not found"
        },
        response: null
      });

    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      seller.password_hash
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

    if (!seller.email_verified) {

      return res.status(403).json({
        status: {
          code: 403,
          message: "Please verify your email before logging in."
        },
        response: null
      });

    }

    const accessToken = jwt.sign(
      {
        sellerId: seller.seller_id,
        email: seller.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m"
      }
    );

    const refreshToken = jwt.sign(
      {
        sellerId: seller.seller_id,
        email: seller.email
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.cookie(
      "sellerRefreshToken",
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

        seller: {

          seller_id: seller.seller_id,

          business_name: seller.business_name,

          owner_name: seller.owner_name,

          email: seller.email,

          phone: seller.phone,

          email_verified: seller.email_verified,

          seller_status: seller.seller_status

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


export const verifyEmail = async (req, res) => {

  try {

    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Verification token is required"
        },
        response: null
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET
    );

    const seller = await findSellerById(decoded.sellerId);

    if (!seller) {

      return res.status(404).json({
        status: {
          code: 404,
          message: "Seller not found"
        },
        response: null
      });

    }

    if (seller.email_verified) {

      return res.status(200).json({

        status: {

          code: 200,

          message: "Email already verified"

        },

        response: null

      });

    }

    const updatedSeller = await verifySellerEmail(decoded.sellerId);

    return res.status(200).json({

      status: {
        code: 200,
        message: "Email verified successfully"
      },

      response: updatedSeller

    });

  }
  catch (error) {

    return res.status(400).json({

      status: {
        code: 400,
        message: "Invalid or expired verification link"
      },

      response: null

    });

  }

};


export const resendVerificationEmail = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        status: {
          code: 400,
          message: "Email is required"
        },
        response: null
      });

    }

    const seller = await findSellerByEmail(email);

    if (!seller) {

      return res.status(404).json({
        status: {
          code: 404,
          message: "Seller not found"
        },
        response: null
      });

    }

    if (seller.email_verified) {

      return res.status(409).json({
        status: {
          code: 409,
          message: "Email already verified"
        },
        response: null
      });

    }

    const verificationToken = jwt.sign(
      {
        sellerId: seller.seller_id
      },
      process.env.EMAIL_VERIFICATION_SECRET,
      {
        expiresIn: "5m"
      }
    );

    const verificationLink =
      `${process.env.FRONTEND_URL}/seller/verify-email?token=${verificationToken}`;

    await commonEmailSender({

      to: seller.email,

      subject: "Verify Your Seller Account",

      html: sellerVerificationEmailTemplate(verificationLink)
    });

    return res.status(200).json({

      status: {
        code: 200,
        message: "Verification email sent successfully"
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


export const forgotSellerPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Email is required"
                },

                response: null

            });

        }

        const seller = await findSellerByEmail(email);

        /*
         * We intentionally return the same success response
         * whether the email exists or not.
         *
         * This prevents revealing whether an email
         * belongs to a seller account.
         */

        if (!seller) {

            return res.status(200).json({

                status: {
                    code: 200,
                    message:
                        "If an account exists with this email, a password reset link has been sent."
                },

                response: null

            });

        }

        const resetToken = jwt.sign(

            {
                sellerId: seller.seller_id
            },

            process.env.PASSWORD_RESET_SECRET,

            {
                expiresIn: "10m"
            }

        );

        const resetLink =
            `${process.env.FRONTEND_URL}/seller/reset-password?token=${resetToken}`;


        await commonEmailSender({

            to: seller.email,

            subject: "Reset Your Seller Password",

            html: sellerPasswordResetEmailTemplate(resetLink)

        });


        return res.status(200).json({

            status: {
                code: 200,
                message:
                    "If an account exists with this email, a password reset link has been sent."
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


export const resetSellerPassword = async (req, res) => {

    try {

        const {
            token,
            password
        } = req.body;


        if (!token) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Reset token is required"
                },

                response: null

            });

        }


        if (!password) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message: "Password is required"
                },

                response: null

            });

        }


        if (password.length < 8) {

            return res.status(400).json({

                status: {
                    code: 400,
                    message:
                        "Password must be at least 8 characters"
                },

                response: null

            });

        }


        const decoded = jwt.verify(

            token,

            process.env.PASSWORD_RESET_SECRET

        );


        const seller = await findSellerById(
            decoded.sellerId
        );


        if (!seller) {

            return res.status(404).json({

                status: {
                    code: 404,
                    message: "Seller not found"
                },

                response: null

            });

        }


        const passwordHash =
            await bcrypt.hash(password, 10);


        const updatedSeller =
            await updateSellerPassword(
                decoded.sellerId,
                passwordHash
            );


        return res.status(200).json({

            status: {
                code: 200,
                message:
                    "Password reset successfully"
            },

            response: {

                seller: {

                    seller_id:
                        updatedSeller.seller_id,

                    email:
                        updatedSeller.email

                }

            }

        });

    }
    catch (error) {

        return res.status(400).json({

            status: {
                code: 400,
                message:
                    "Invalid or expired password reset link"
            },

            response: null

        });

    }

};