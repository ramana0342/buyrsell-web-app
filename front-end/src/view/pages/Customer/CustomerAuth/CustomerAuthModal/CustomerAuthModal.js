import React, {
    useEffect,
    useState
} from "react";

import "./CustomerAuthModal.scss";

import {
    FaTimes
} from "react-icons/fa";

import RegisterForm
    from "../RegisterForm/RegisterForm";

import LoginForm
    from "../LoginForm/LoginForm";

import EmailVerification
    from "../EmailVerification/EmailVerification";

import OTPVerification
    from "../OTPVerification/OTPVerification";

import ForgotPassword
    from "../ForgotPassword/ForgotPassword";

import ForgotPasswordOtp
    from "../ForgotPassword/ForgotPasswordOtp";

import ResetPassword
    from "../ForgotPassword/ResetPassword";


const modalContent = {

    login: {

        title:
            "Welcome Back",

        subtitle:
            "Login to continue shopping."

    },


    register: {

        title:
            "Create Account",

        subtitle:
            "Create your buyRsell Mart account."

    },


    verification: {

        title:
            "Verify Email",

        subtitle:
            "Verify your email to secure your account."

    },


    otp: {

        title:
            "Enter OTP",

        subtitle:
            "Enter the 6-digit OTP sent to your email."

    },


    forgotPassword: {

        title:
            "Forgot Password?",

        subtitle:
            "Enter your email to reset your password."

    },


    forgotPasswordOtp: {

        title:
            "Verify OTP",

        subtitle:
            "Enter the OTP sent to your email."

    },


    resetPassword: {

        title:
            "Create New Password",

        subtitle:
            "Choose a new password for your account."

    }

};


const CustomerAuthModal = ({

    isOpen,

    onClose,

    initialScreen = "login"

}) => {


    const [
        activeScreen,
        setActiveScreen
    ] = useState("login");


    const [
        customer,
        setCustomer
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(false);


    /*
     * Forgot password state
     */

    const [
        resetEmail,
        setResetEmail
    ] = useState("");


    const [
        resetToken,
        setResetToken
    ] = useState("");


    /*
     * Close modal
     */

    const closeAuthModal = () => {

        if (loading) return;


        setActiveScreen("login");

        setCustomer(null);

        setResetEmail("");

        setResetToken("");

        onClose();

    };


    /*
     * Prevent background scrolling
     */

    useEffect(() => {

        if (!isOpen) {

            document.body.style.overflow = "";

            return;

        }


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                "";

        };

    }, [isOpen]);


    /*
     * Set initial screen
     */

    useEffect(() => {

        if (isOpen) {

            setActiveScreen(
                initialScreen
            );

            setCustomer(null);

            setResetEmail("");

            setResetToken("");

        }

    }, [
        isOpen,
        initialScreen
    ]);


    /*
     * Escape key
     */

    useEffect(() => {

        const handleEsc = (e) => {

            if (
                e.key === "Escape"
            ) {

                closeAuthModal();

            }

        };


        if (isOpen) {

            window.addEventListener(
                "keydown",
                handleEsc
            );

        }


        return () => {

            window.removeEventListener(
                "keydown",
                handleEsc
            );

        };

    }, [
        isOpen,
        loading
    ]);


    if (!isOpen) {

        return null;

    }


    /*
     * Registration success
     */

    const handleRegisterSuccess = (
        customerData
    ) => {

        setCustomer(
            customerData
        );

        setActiveScreen(
            "verification"
        );

    };


    /*
     * Skip email verification
     */

    const handleVerificationSkip = () => {

        closeAuthModal();

    };


    /*
     * Email verification OTP sent
     */

    const handleOtpSent = () => {

        setActiveScreen(
            "otp"
        );

    };


    /*
     * Email verification completed
     */

    const handleOtpVerified = () => {

        closeAuthModal();

    };


    /*
     * Forgot password OTP sent
     */

    const handlePasswordResetOtpSent = (
        email
    ) => {

        setResetEmail(
            email
        );

        setActiveScreen(
            "forgotPasswordOtp"
        );

    };


    /*
     * Password reset OTP verified
     */

    const handlePasswordResetOtpVerified = (
        data
    ) => {

        setResetToken(
            data.resetToken
        );

        setActiveScreen(
            "resetPassword"
        );

    };


    /*
     * Password reset completed
     */

    const handlePasswordResetSuccess = () => {

        setResetEmail("");

        setResetToken("");

        setActiveScreen(
            "login"
        );

    };


    return (

        <div

            className="customer-auth-modal"

            onClick={
                closeAuthModal
            }

        >

            <div

                className={
                    `customer-auth-modal__container ` +
                    `customer-auth-modal__container--${activeScreen}`
                }

                onClick={(e) =>
                    e.stopPropagation()
                }

            >

                <button

                    className="customer-auth-modal__close"

                    onClick={
                        closeAuthModal
                    }

                    disabled={
                        loading
                    }

                >

                    <FaTimes />

                </button>


                <div className="customer-auth-modal__header">

                    <h2>

                        {
                            modalContent[
                                activeScreen
                            ].title
                        }

                    </h2>


                    <p>

                        {
                            modalContent[
                                activeScreen
                            ].subtitle
                        }

                    </p>

                </div>


                <div className="customer-auth-modal__body">


                    {/* LOGIN */}

                    {
                        activeScreen === "login" && (

                            <LoginForm

                                setLoading={
                                    setLoading
                                }

                                goToRegister={() =>
                                    setActiveScreen(
                                        "register"
                                    )
                                }

                                goToForgotPassword={() =>
                                    setActiveScreen(
                                        "forgotPassword"
                                    )
                                }

                                onLoginSuccess={
                                    closeAuthModal
                                }

                            />

                        )
                    }


                    {/* REGISTER */}

                    {
                        activeScreen === "register" && (

                            <RegisterForm

                                setLoading={
                                    setLoading
                                }

                                onRegisterSuccess={
                                    handleRegisterSuccess
                                }

                                goToLogin={() =>
                                    setActiveScreen(
                                        "login"
                                    )
                                }

                            />

                        )
                    }


                    {/* EMAIL VERIFICATION */}

                    {
                        activeScreen === "verification" && (

                            <EmailVerification

                                setLoading={
                                    setLoading
                                }

                                customer={
                                    customer
                                }

                                onSkip={
                                    handleVerificationSkip
                                }

                                onOtpSent={
                                    handleOtpSent
                                }

                            />

                        )
                    }


                    {/* EMAIL OTP */}

                    {
                        activeScreen === "otp" && (

                            <OTPVerification

                                setLoading={
                                    setLoading
                                }

                                customer={
                                    customer
                                }

                                onBack={() =>
                                    setActiveScreen(
                                        "verification"
                                    )
                                }

                                onVerified={
                                    handleOtpVerified
                                }

                            />

                        )
                    }


                    {/* FORGOT PASSWORD */}

                    {
                        activeScreen === "forgotPassword" && (

                            <ForgotPassword
                                onOtpSent={
                                    handlePasswordResetOtpSent
                                }

                                goToLogin={() =>
                                    setActiveScreen(
                                        "login"
                                    )
                                }
                            />

                        )
                    }


                    {/* PASSWORD RESET OTP */}

                    {
                        activeScreen === "forgotPasswordOtp" && (

                            <ForgotPasswordOtp

                                email={
                                    resetEmail
                                }

                                onBack={() =>
                                    setActiveScreen(
                                        "forgotPassword"
                                    )
                                }

                                onVerified={
                                    handlePasswordResetOtpVerified
                                }

                            />

                        )
                    }


                    {/* RESET PASSWORD */}

                    {
                        activeScreen === "resetPassword" && (

                            <ResetPassword

                                email={
                                    resetEmail
                                }

                                resetToken={
                                    resetToken
                                }

                                onResetSuccess={
                                    handlePasswordResetSuccess
                                }

                            />

                        )
                    }


                </div>

            </div>

        </div>

    );

};


export default CustomerAuthModal;