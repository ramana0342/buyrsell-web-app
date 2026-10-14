import React, { useState } from "react";

import "./EmailVerification.scss";

import {

    FaEnvelopeOpenText,
    FaPaperPlane,
    FaArrowRight,
    FaSpinner,
    FaCheckCircle

} from "react-icons/fa";

import {

    sendEmailOtp

} from "../../../../../network/customerApiService/customerAuthService";

const EmailVerification = ({

    customer,

    onSkip,

    onOtpSent,

    setLoading

}) => {


    const [success, setSuccess] = useState(false);

    const [sendingOtp, setSendingOtp] = useState(false);

    const handleSendOtp = async () => {

        try {

            setLoading(true);

            setSendingOtp(true);

            await sendEmailOtp();

            setSuccess(true);

            setTimeout(() => {

                onOtpSent();

            }, 700);

        }
        catch (error) {

            alert(

                error.response?.data?.status?.message ||

                "Unable to send OTP."

            );

        }
        finally {

            setSendingOtp(false);

            setLoading(false);

        }

    };

    return (

        <div className="email-verification">

            <div className="email-verification__icon">

                {

                    success

                        ?

                        <FaCheckCircle />

                        :

                        <FaEnvelopeOpenText />

                }

            </div>

            <h3>

                Verify Your Email

            </h3>

            <p>

                Hi

                <strong>

                    {" "}

                    {customer?.full_name}

                </strong>

            </p>

            <p>

                Email verification is optional.

                Verify now to secure your account and receive password reset emails and important security notifications.

            </p>

            <div className="email-verification__email">

                {customer?.email}

            </div>

            <div className="email-verification__actions">

                <button

                    className="email-verification__send"

                    onClick={handleSendOtp}

                    disabled={sendingOtp}

                >

                    {

                        sendingOtp

                            ?

                            <>

                                <FaSpinner className="spin" />

                                Sending...

                            </>

                            :

                            <>

                                <FaPaperPlane />

                                Send OTP

                            </>

                    }

                </button>

                <button

                    className="email-verification__skip"

                    onClick={onSkip}

                    disabled={sendingOtp}

                >

                    Skip For Now

                    <FaArrowRight />

                </button>

            </div>

            <div className="email-verification__note">

                You can verify your email later anytime

                from your account settings.

            </div>

        </div>

    );

};

export default EmailVerification;