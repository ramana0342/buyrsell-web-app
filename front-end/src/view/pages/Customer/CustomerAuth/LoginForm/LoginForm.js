import React, { useState } from "react";

import "./LoginForm.scss";

import { useForm } from "react-hook-form";

import {

    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash

} from "react-icons/fa";

import { useDispatch } from "react-redux";

import { loginSuccess } from "../../../../../features/customer/customerSlice";

import { customerLogin } from "../../../../../network/customerApiService/customerAuthService";

const LoginForm = ({

    onLoginSuccess,

    goToRegister,

    goToVerification,

    goToForgotPassword


}) => {

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);

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

            const payload = {

                ...formData,

                email: formData.email.trim()

            };

            const res = await customerLogin(payload);

            dispatch(

                loginSuccess({

                    customer: res.response.customer,

                    accessToken: res.response.accessToken

                })

            );

            onLoginSuccess();

        }

        catch (error) {

            const message =
                error.response?.data?.status?.message;

            if (
                error.response?.status === 403 &&
                message?.toLowerCase().includes("verify")
            ) {

                goToVerification?.();

                return;

            }

            alert(message || "Login failed");

        }

    };

    return (

        <form

            className="customer-login"

            onSubmit={handleSubmit(onSubmit)}

        >

            <div className="customer-login__field">

                <label>

                    Email Address

                </label>

                <div className="customer-login__input-box">

                    <FaEnvelope />

                    <input
                        disabled={isSubmitting}
                        type="email"
                        autoComplete="email"

                        autoFocus

                        placeholder="Enter your email"

                        {

                        ...register(

                            "email",

                            {

                                required: "Email is required",

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

                    errors.email &&

                    <span className="customer-login__error">

                        {errors.email.message}

                    </span>

                }

            </div>

            <div className="customer-login__field">

                <label>

                    Password

                </label>

                <div className="customer-login__input-box">

                    <FaLock />

                    <input

                        autoComplete="current-password"
                        disabled={isSubmitting}

                        type={

                            showPassword

                                ?

                                "text"

                                :

                                "password"

                        }

                        placeholder="Enter password"

                        {

                        ...register(

                            "password",

                            {

                                required: "Password is required"

                            }

                        )

                        }

                    />

                    <button

                        type="button"

                        disabled={isSubmitting}

                        className="customer-login__toggle"

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

                    errors.password &&

                    <span className="customer-login__error">

                        {errors.password.message}

                    </span>

                }

            </div>

            <div className="customer-login__forgot">

                <button
                    type="button"
                    disabled={isSubmitting}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        goToForgotPassword?.();
                    }}
                >
                    Forgot Password?
                </button>

            </div>

            <button

                type="submit"

                disabled={isSubmitting}

                className="customer-login__button"

            >

                {

                    isSubmitting

                        ?

                        "Signing In..."

                        :

                        "Login"

                }

            </button>

            <div className="customer-login__footer">

                Don't have an account?

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        goToRegister?.();
                    }}
                >
                    Register
                </button>

            </div>

        </form>

    );

};

export default LoginForm;