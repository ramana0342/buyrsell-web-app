import "./PasswordResetSent.scss";

import { Link } from "react-router-dom";
import { MdMarkEmailRead } from "react-icons/md";

import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import Button from "../../../components/Button/Button";


const PasswordResetSent = () => {

    return (

        <AuthLayout
            title="Check Your Email"
            subtitle="We've sent instructions to reset your seller account password."
        >

            <div className="password-reset-sent">

                <MdMarkEmailRead className="email-icon" />

                <h3>
                    Password Reset Email Sent
                </h3>

                <p>
                    If an account exists with the email address
                    you provided, we've sent a password reset link.
                </p>

                <p>
                    Please check your inbox and click the
                    <strong> Reset Password </strong>
                    link to create a new password.
                </p>

                <Button
                    type="button"
                    onClick={() =>
                        window.open(
                            "https://mail.google.com",
                            "_blank"
                        )
                    }
                >
                    Open Gmail
                </Button>

            </div>

            <div className="auth-footer">

                <Link to="/seller/login">
                    Back to Login
                </Link>

            </div>

        </AuthLayout>

    );

};


export default PasswordResetSent;