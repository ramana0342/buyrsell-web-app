import "./VerifyEmail.scss";
import { MdEmail } from "react-icons/md";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { emailVerified } from "../../../../features/seller/sellerSlice";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { verifySellerEmail, resendVerificationEmail } from "../../../../network/sellerApiService/sellerAuthService";
import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import Button from "../../../components/Button/Button";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    useEffect(() => {

        const verify = async () => {

            const token = searchParams.get("token");

            if (!token) {

                setMessage("Invalid verification link");

                setLoading(false);

                return;

            }

            try {

                const res = await verifySellerEmail(token);

                dispatch(emailVerified());

                setMessage(res.status.message);

                setTimeout(() => {

                    navigate("/seller/login");

                }, 2000);

            } catch (error) {

                setMessage(
                    error.response?.data?.status?.message ||
                    "Verification failed"
                );

            } finally {

                setLoading(false);

            }

        };

        verify();

    }, []);


    const handleResend = async () => {
        console.log("123TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        const seller = JSON.parse(
            localStorage.getItem("sellerProfileData")
        );

        if (!seller) {

            setMessage("Seller information not found.");

            return;

        }

        try {

            const res = await resendVerificationEmail({

                email: seller.email

            });

            setMessage(res.status.message);

        } catch (error) {

            setMessage(

                error.response?.data?.status?.message ||

                "Unable to resend verification email."

            );

        }

    };


    return (

        <AuthLayout
            title="Verify Your Email"
            subtitle="Activate your seller account."
        >

            <div className="verify-email">

                <MdEmail className="email-icon" />

                <h3>Check Your Inbox</h3>
                <p>

                    {

                        loading

                            ?

                            "Verifying your email..."

                            :

                            message

                    }

                </p>

                <Button onClick={() => { handleResend() }}>
                    Resend Verification Email
                </Button>

                <div className="login-link">

                    <Link to="/seller/login">

                        Back to Login

                    </Link>

                </div>

            </div>

        </AuthLayout>

    );
};

export default VerifyEmail;