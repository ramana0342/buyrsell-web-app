import React from "react";

import "./ForgotPassword.scss";

import {
    FaEnvelope
} from "react-icons/fa";

import {
    useForm
} from "react-hook-form";

import {
    sendPasswordResetOtp
} from "../../../../../network/customerApiService/customerAuthService";


const ForgotPassword = ({

    onOtpSent,

    goToLogin

}) => {

    const {

        register,

        handleSubmit,

        formState: {
            errors,
            isSubmitting
        }

    } = useForm({

        mode: "onTouched"

    });


    const onSubmit = async (formData) => {

        try {

            const email =
                formData.email
                    .trim()
                    .toLowerCase();

            const res =
                await sendPasswordResetOtp({

                    email

                });

            /*
             * Even if the email does not exist,
             * backend returns the same response.
             *
             * Move to OTP screen.
             */

            onOtpSent(email);

        }
        catch (error) {

            const message =
                error.response
                    ?.data
                    ?.status
                    ?.message;

            alert(
                message ||
                "Unable to send OTP"
            );

        }

    };


    return (

        <form

            className="customer-forgot-password"

            onSubmit={
                handleSubmit(onSubmit)
            }

        >

            <div
                className="customer-forgot-password__field"
            >

                <label>
                    Email Address
                </label>

                <div
                    className="customer-forgot-password__input-box"
                >

                    <FaEnvelope />

                    <input

                        type="email"

                        disabled={
                            isSubmitting
                        }

                        autoFocus

                        autoComplete="email"

                        placeholder="Enter your email"

                        {
                        ...register(
                            "email",
                            {

                                required:
                                    "Email is required",

                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter valid email"
                                }

                            }
                        )
                        }

                    />

                </div>

                {
                    errors.email && (

                        <span
                            className="customer-forgot-password__error"
                        >
                            {
                                errors.email.message
                            }
                        </span>

                    )
                }

            </div>


            <button

                type="submit"

                disabled={isSubmitting}

                className="customer-forgot-password__button"

            >

                {
                    isSubmitting
                        ?
                        "Sending OTP..."
                        :
                        "Send OTP"
                }

            </button>


            <div
                className="customer-forgot-password__footer"
            >

                Remember your password?

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        goToLogin?.();
                    }}
                >
                    Login
                </button>

            </div>

        </form>

    );

};

export default ForgotPassword;