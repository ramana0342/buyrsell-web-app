import "./RegistrationSuccess.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import Button from "../../../components/Button/Button";
import { useSelector } from "react-redux";
import { resendVerificationEmail } from "../../../../network/sellerApiService/sellerAuthService";

const RegistrationSuccess = () => {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const seller = useSelector(
    (state) => state.seller.seller
  );

  const handleResend = async () => {

    if (!seller) return;

    try {

      setLoading(true);

      const res =
        await resendVerificationEmail({

          email: seller.email

        });

      setMessage(res.status.message);

    }
    catch (error) {

      setMessage(

        error.response?.data?.status?.message ||

        "Unable to resend email."

      );

    }
    finally {

      setLoading(false);

    }

  };

  return (
    <AuthLayout
      title="Registration Successful"
      subtitle="Your seller account has been created successfully."
    >
      <div className="registration-success">

        <FaCheckCircle className="success-icon" />

        <h3>Account Created Successfully</h3>

        <p>
          We've sent a verification email to your registered email address.
          Please verify your email before logging in.
        </p>

        {message && (

          <p className="success-message">

            {message}

          </p>

        )}

        <Button
          type="button"
          onClick={() => window.open("https://mail.google.com", "_blank")}
        >

          Open Gmail

        </Button>

        <Button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className=" primary mt-2"
        >

          {

            loading

              ? "Sending..."

              : "Resend Verification Email"

          }

        </Button>

      </div>
    </AuthLayout>
  );
};

export default RegistrationSuccess;