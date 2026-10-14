import React, { useState } from "react";

import "./ResetPassword.scss";

import {

    FaLock,
    FaEye,
    FaEyeSlash

} from "react-icons/fa";

import {
    useForm
} from "react-hook-form";

import {
    resetCustomerPassword
} from "../../../../../network/customerApiService/customerAuthService";


const ResetPassword = ({

    email,

    resetToken,

    onResetSuccess

}) => {

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const {

        register,

        handleSubmit,

        watch,

        formState: {
            errors,
            isSubmitting
        }

    } = useForm({

        mode: "onTouched"

    });


    const password =
        watch("password");


    const onSubmit = async (formData) => {

        try {

            await resetCustomerPassword({

                email,

                password:
                    formData.password,

                resetToken

            });


            alert(
                "Password reset successfully. Please login with your new password."
            );


            onResetSuccess();

        }
        catch (error) {

            const message =
                error.response
                    ?.data
                    ?.status
                    ?.message;

            alert(

                message ||
                "Unable to reset password"

            );

        }

    };


    return (

        <form

            className="customer-reset-password"

            onSubmit={
                handleSubmit(onSubmit)
            }

        >

            <div className="customer-reset-password__info">

                <p>
                    Create a new password for
                </p>

                <strong>
                    {email}
                </strong>

            </div>


            <div className="customer-reset-password__field">

                <label>
                    New Password
                </label>


                <div className="customer-reset-password__input-box">

                    <FaLock />

                    <input

                        type={
                            showPassword
                                ?
                                "text"
                                :
                                "password"
                        }

                        autoFocus

                        autoComplete="new-password"

                        disabled={
                            isSubmitting
                        }

                        placeholder="Enter new password"

                        {...register(

                            "password",

                            {

                                required:
                                    "Password is required",

                                minLength: {

                                    value: 8,

                                    message:
                                        "Password must be at least 8 characters"

                                }

                            }

                        )}

                    />


                    <button

                        type="button"

                        className="customer-reset-password__toggle"

                        disabled={
                            isSubmitting
                        }

                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }

                    >

                        {

                            showPassword

                                ?

                                <FaEye />

                                :

                                <FaEyeSlash />

                        }

                    </button>

                </div>


                {

                    errors.password && (

                        <span className="customer-reset-password__error">

                            {
                                errors.password.message
                            }

                        </span>

                    )

                }

            </div>


            <div className="customer-reset-password__field">

                <label>
                    Confirm Password
                </label>


                <div className="customer-reset-password__input-box">

                    <FaLock />

                    <input

                        type={
                            showConfirmPassword
                                ?
                                "text"
                                :
                                "password"
                        }

                        autoComplete="new-password"

                        disabled={
                            isSubmitting
                        }

                        placeholder="Confirm new password"

                        {...register(

                            "confirmPassword",

                            {

                                required:
                                    "Please confirm your password",

                                validate:
                                    (value) =>

                                        value === password ||

                                        "Passwords do not match"

                            }

                        )}

                    />


                    <button

                        type="button"

                        className="customer-reset-password__toggle"

                        disabled={
                            isSubmitting
                        }

                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }

                    >

                        {

                            showConfirmPassword

                                ?

                                <FaEye />

                                :

                                <FaEyeSlash />

                        }

                    </button>

                </div>


                {

                    errors.confirmPassword && (

                        <span className="customer-reset-password__error">

                            {
                                errors.confirmPassword.message
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

                className="customer-reset-password__button"

            >

                {

                    isSubmitting

                        ?

                        "Resetting Password..."

                        :

                        "Reset Password"

                }

            </button>

        </form>

    );

};


export default ResetPassword;