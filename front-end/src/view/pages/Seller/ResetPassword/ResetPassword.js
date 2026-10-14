import "./ResetPassword.scss";

import {
  Link,
  useNavigate,
  useSearchParams
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
  resetSellerPassword
} from "../../../../network/sellerApiService/sellerAuthService";


const ResetPassword = () => {

  const navigate = useNavigate();

  const [
    searchParams
  ] = useSearchParams();


  const token =
    searchParams.get("token");


  const {

    register,

    handleSubmit,

    watch,

    formState: {
      errors,
      isSubmitting
    }

  } = useForm();


  const password =
    watch("password");


  const onSubmit = async (data) => {

    try {

      await resetSellerPassword({

        token,

        password:
          data.password

      });


      alert(
        "Password reset successfully. Please login with your new password."
      );


      navigate(
        "/seller/login"
      );

    }
    catch (error) {

      const message =
        error.response?.data?.status?.message
        || "Unable to reset password";

      alert(message);

    }

  };


  if (!token) {

    return (

      <AuthLayout
        title="Invalid Reset Link"
        subtitle="The password reset link is missing or invalid."
      >

        <div className="auth-footer">

          <Link to="/seller/forgot-password">
            Request a new reset link
          </Link>

        </div>

      </AuthLayout>

    );

  }


  return (

    <AuthLayout

      title="Reset Password"

      subtitle="Create a new password for your seller account."

    >
       <div className="seller-reset-password-form-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
      >

        <Input

          id="password"

          label="New Password"

          type="password"

          placeholder="Enter new password"

          required

          error={
            errors.password?.message
          }

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


        <Input

          id="confirmPassword"

          label="Confirm Password"

          type="password"

          placeholder="Confirm new password"

          required

          error={
            errors.confirmPassword?.message
          }

          {...register(
            "confirmPassword",
            {

              required:
                "Please confirm your password",

              validate: (
                value
              ) =>

                value === password
                ||
                "Passwords do not match"

            }
          )}

        />


        <Button

          type="submit"

          disabled={isSubmitting}

        >

          {
            isSubmitting
              ? "Updating..."
              : "Update Password"
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


export default ResetPassword;