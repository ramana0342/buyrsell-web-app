import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { sellerLogin } from "../../../../network/sellerApiService/sellerAuthService";
import "./Login.scss";
import { useDispatch } from "react-redux";

import {
    loginSuccess
} from "../../../../features/seller/sellerSlice";

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {

        register,

        handleSubmit,

        formState: {
            errors,
            isSubmitting
        }

    } = useForm();

    const onSubmit = async (data) => {

        try {

            const res = await sellerLogin(data);

            dispatch(

                loginSuccess({

                    seller: res.response.seller,

                    accessToken: res.response.accessToken

                })

            );

            navigate("/seller/dashboard");

        } catch (error) {

            const message =
                error.response?.data?.status?.message;

            if (
                error.response?.status === 403
            ) {

                navigate("/seller/registration-success");

                return;

            }

            alert(message || "Login failed");

        }

    };

    return (

        <AuthLayout
            title="Seller Login"
            subtitle="Login to manage your products and orders."
        >

            <div className="seller-login-form-container">

                <form onSubmit={handleSubmit(onSubmit)}>

                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter email"
                        required
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required"
                        })}
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        required
                        className="login-password-field"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required"
                        })}
                    />

                    <div className="forgot-password">
                        <Link to="/seller/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {
                            isSubmitting
                                ? "Logging in..."
                                : "Login"
                        }
                    </Button>

                </form>

            </div>

            <div className="auth-footer">
                Don't have an account?
                <Link to="/seller/register">
                    Register
                </Link>
            </div>

        </AuthLayout>

    );

};

export default Login;