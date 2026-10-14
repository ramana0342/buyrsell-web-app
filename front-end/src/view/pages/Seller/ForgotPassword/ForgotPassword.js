import "./ForgotPassword.scss";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useForm
} from "react-hook-form";

import AuthLayout
  from "../../../components/AuthLayout/AuthLayout";

import Input
  from "../../../components/Input/Input";

import Button
  from "../../../components/Button/Button";

import {
  forgotSellerPassword
} from "../../../../network/sellerApiService/sellerAuthService";


const ForgotPassword = () => {

  const navigate = useNavigate();


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

      await forgotSellerPassword(data);

      navigate("/seller/password-reset-sent");

    }
    catch (error) {

      const message =
        error.response?.data?.status?.message
        || "Something went wrong";

      alert(message);

    }

  };


  return (

    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your registered email address. We'll send you a password reset link."
    >

      <div className="seller-forgot-password-form-container">

        <form
          onSubmit={handleSubmit(onSubmit)}
        >

          <Input

            id="email"

            label="Email Address"

            type="email"

            placeholder="Enter your email"

            required

            error={
              errors.email?.message
            }

            {...register(
              "email",
              {
                required:
                  "Email is required",

                pattern: {

                  value:
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                  message:
                    "Enter a valid email address"

                }

              }
            )}

          />


          <Button

            type="submit"

            disabled={isSubmitting}

          >

            {
              isSubmitting
                ? "Sending..."
                : "Send Reset Link"
            }

          </Button>

        </form>

      </div>


      <div className="auth-footer">

        <Link to="/seller/login">
          Back to Login
        </Link>

      </div>

    </AuthLayout>

  );

};


export default ForgotPassword;