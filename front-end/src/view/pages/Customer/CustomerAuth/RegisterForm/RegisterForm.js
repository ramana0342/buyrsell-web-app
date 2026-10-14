import React, { useState } from "react";

import "./RegisterForm.scss";

import { useForm } from "react-hook-form";

import {

    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaLock,
    FaUser

} from "react-icons/fa";

import { useDispatch } from "react-redux";

import {

    loginSuccess

} from "../../../../../features/customer/customerSlice";

import {

    customerRegister

} from "../../../../../network/customerApiService/customerAuthService";

const RegisterForm = ({

    onRegisterSuccess,

    goToLogin,
    setLoading

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

            setLoading(true);

            const res = await customerRegister(formData);

            dispatch(

                loginSuccess({

                    customer: res.response.customer,

                    accessToken: res.response.accessToken

                })

            );

            onRegisterSuccess(

                res.response.customer

            );

        }
        catch (error) {

            alert(

                error.response?.data?.status?.message ||

                "Registration failed"

            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <form

            className="customer-register"

            onSubmit={handleSubmit(onSubmit)}

        >

            <div className="customer-register__field">

                <label>

                    Full Name

                </label>

                <div className="customer-register__input-box">

                    <FaUser />

                    <input

                        type="text"

                        placeholder="Enter your full name"
                        disabled={isSubmitting}

                        {

                        ...register(

                            "fullName",

                            {

                                required:

                                    "Full name is required"

                            }

                        )

                        }

                    />

                </div>

                {

                    errors.fullName &&

                    <span className="customer-register__error">

                        {

                            errors.fullName.message

                        }

                    </span>

                }

            </div>

            <div className="customer-register__field">

                <label>

                    Email Address

                </label>

                <div className="customer-register__input-box">

                    <FaEnvelope />

                    <input

                        type="email"

                        placeholder="Enter your email"
                        disabled={isSubmitting}

                        {

                        ...register(

                            "email",

                            {

                                required:

                                    "Email is required",

                                pattern: {

                                    value:

                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                    message:

                                        "Enter valid email"

                                }

                            }

                        )

                        }

                    />

                </div>

                {

                    errors.email &&

                    <span className="customer-register__error">

                        {

                            errors.email.message

                        }

                    </span>

                }

            </div>

            <div className="customer-register__field">

                <label>

                    Password

                </label>

                <div className="customer-register__input-box">

                    <FaLock />

                    <input
                        disabled={isSubmitting}
                        type={

                            showPassword

                                ? "text"

                                : "password"

                        }

                        placeholder="Minimum 8 characters"

                        {

                        ...register(

                            "password",

                            {

                                required:

                                    "Password is required",

                                minLength: {

                                    value: 8,

                                    message:

                                        "Minimum 8 characters"

                                }

                            }

                        )

                        }

                    />

                    <button

                        type="button"
                        disabled={isSubmitting}
                        className="customer-register__toggle"

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

                    <span className="customer-register__error">

                        {

                            errors.password.message

                        }

                    </span>

                }

            </div>

            <div className="customer-register__password-note">

                Password must contain at least 8 characters.

            </div>

            <button

                type="submit"

                disabled={isSubmitting}

                className="customer-register__button"

            >

                {

                    isSubmitting

                        ?

                        "Creating Account..."

                        :

                        "Create Account"

                }

            </button>

            <div className="customer-register__footer">

                Already have an account?

                <button

                    type="button"

                    onClick={goToLogin}

                >

                    Login

                </button>

            </div>

        </form>

    );

};

export default RegisterForm;