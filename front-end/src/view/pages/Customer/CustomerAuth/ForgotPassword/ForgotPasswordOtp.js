import React from "react";

import "./ForgotPasswordOtp.scss";

import {
    FaKey
} from "react-icons/fa";

import {
    useForm
} from "react-hook-form";

import {
    verifyPasswordResetOtp
} from "../../../../../network/customerApiService/customerAuthService";


const ForgotPasswordOtp = ({

    email,

    onVerified,

    onBack

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

            const res =
                await verifyPasswordResetOtp({

                    email,

                    otp: formData.otp

                });


            onVerified(
                res.response
            );

        }
        catch (error) {

            const message =
                error.response
                    ?.data
                    ?.status
                    ?.message;

            alert(
                message ||
                "Invalid OTP"
            );

        }

    };


    return (

        <form

            className="customer-forgot-password-otp"

            onSubmit={
                handleSubmit(onSubmit)
            }

        >

            <div className="customer-forgot-password-otp__info">

                <p>

                    We sent a 6-digit verification code to

                </p>

                <strong>
                    {email}
                </strong>

            </div>


            <div className="customer-forgot-password-otp__field">

                <label>
                    Enter OTP
                </label>


                <div className="customer-forgot-password-otp__input-box">

                    <FaKey />

                    <input

                        type="text"

                        inputMode="numeric"

                        maxLength={6}

                        autoFocus

                        disabled={
                            isSubmitting
                        }

                        autoComplete="one-time-code"

                        placeholder="Enter 6-digit OTP"

                        {...register(

                            "otp",

                            {

                                required:
                                    "OTP is required",

                                pattern: {

                                    value:
                                        /^\d{6}$/,

                                    message:
                                        "Enter a valid 6-digit OTP"

                                }

                            }

                        )}

                    />

                </div>


                {
                    errors.otp && (

                        <span className="customer-forgot-password-otp__error">

                            {
                                errors.otp.message
                            }

                        </span>

                    )
                }

            </div>


            <button

                type="submit"

                disabled={
                    isSubmitting
                }

                className="customer-forgot-password-otp__button"

            >

                {

                    isSubmitting

                        ?

                        "Verifying..."

                        :

                        "Verify OTP"

                }

            </button>


            <div className="customer-forgot-password-otp__footer">

                <button

                    type="button"

                    disabled={
                        isSubmitting
                    }

                    onClick={
                        onBack
                    }

                >

                    Back to Email

                </button>

            </div>

        </form>

    );

};


export default ForgotPasswordOtp;