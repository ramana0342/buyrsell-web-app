import React, { useEffect, useRef, useState } from "react";

import "./OTPVerification.scss";

import {

    FaArrowLeft,
    FaCheckCircle,
    FaRedoAlt

} from "react-icons/fa";

import {

    verifyEmailOtp,
    resendEmailOtp

} from "../../../../../network/customerApiService/customerAuthService";

import {

    useDispatch

} from "react-redux";

import {

    emailVerified

} from "../../../../../features/customer/customerSlice";

const OTPVerification = ({

    onBack,

    onVerified,

    setLoading

}) => {

    const dispatch = useDispatch();

    const inputRefs = useRef([]);

    const [otp, setOtp] = useState([

        "",

        "",

        "",

        "",

        "",

        ""

    ]);

    const [verifying, setVerifying] = useState(false);

    const [resending, setResending] = useState(false);

    const [seconds, setSeconds] = useState(60);

    useEffect(() => {

        inputRefs.current[0]?.focus();

    }, []);

    useEffect(() => {

        if (seconds <= 0) return;

        const timer = setInterval(() => {

            setSeconds((prev) => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [seconds]);

    const handleChange = (

        value,

        index

    ) => {

        if (!/^\d*$/.test(value)) return;

        const updatedOtp = [...otp];

        updatedOtp[index] = value.slice(-1);

        setOtp(updatedOtp);

        if (

            value &&

            index < 5

        ) {

            inputRefs.current[index + 1]?.focus();

        }

        const finalOtp = updatedOtp.join("");

        if (finalOtp.length === 6) {

            handleVerify(finalOtp);

        }

    };

    const handleKeyDown = (

        e,

        index

    ) => {

        if (

            e.key === "Backspace" &&

            !otp[index] &&

            index > 0

        ) {

            inputRefs.current[index - 1]?.focus();

        }

    };

    const handleVerify = async (enteredOtp = otp.join("")) => {

        if (enteredOtp.length !== 6) {

            alert("Enter complete OTP");

            return;

        }

        try {

            setLoading?.(true);

            setVerifying(true);

            await verifyEmailOtp({

                otp: enteredOtp

            });

            dispatch(emailVerified());

            onVerified();

        }

        catch (error) {

            alert(

                error.response?.data?.status?.message ||

                "OTP verification failed"

            );

        }

        finally {

            setVerifying(false);

            setLoading?.(false);

        }

    };

    const handleResend = async () => {

        try {

            setResending(true);

            await resendEmailOtp();

            setSeconds(60);

        }

        catch (error) {

            alert(

                error.response?.data?.status?.message ||

                "Unable to resend OTP"

            );

        }

        finally {

            setResending(false);

        }

    };


    const handlePaste = (e) => {

        e.preventDefault();

        const pastedOtp = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (pastedOtp.length === 6) {

            const otpArray = pastedOtp.split("");

            setOtp(otpArray);

            inputRefs.current[5]?.focus();

            handleVerify(pastedOtp);

        }

    };

    return (

        <div className="otp-verification">

            <div className="otp-verification__success-icon">

                <FaCheckCircle />

            </div>

            <h3>

                Verify OTP

            </h3>

            <p>

                Enter the

                6-digit OTP

                sent to your email.

            </p>

            <div className="otp-verification__inputs">

                {

                    otp.map(

                        (

                            digit,

                            index

                        ) => (

                            <input
                                onPaste={handlePaste}
                                key={index}

                                ref={(el) =>

                                    inputRefs.current[index] = el

                                }

                                disabled={

                                    verifying ||

                                    resending

                                }

                                value={digit}

                                maxLength={1}

                                onChange={(e) =>

                                    handleChange(

                                        e.target.value,

                                        index

                                    )

                                }

                                onKeyDown={(e) =>

                                    handleKeyDown(

                                        e,

                                        index

                                    )

                                }

                            />

                        )

                    )

                }

            </div>

            <button

                className="otp-verification__verify"

                onClick={handleVerify}

                disabled={verifying}

            >

                {

                    verifying

                        ?

                        "Verifying..."

                        :

                        "Verify OTP"

                }

            </button>

            <div className="otp-verification__resend">

                {

                    seconds > 0

                        ?

                        <span>

                            Resend OTP in {seconds}s

                        </span>

                        :

                        <button

                            onClick={handleResend}

                            disabled={resending}

                        >

                            <FaRedoAlt />

                            {

                                resending

                                    ?

                                    "Sending..."

                                    :

                                    "Resend OTP"

                            }

                        </button>

                }

            </div>

            <button

                className="otp-verification__back"

                onClick={onBack}

                disabled={

                    verifying ||

                    resending

                }

            >

                <FaArrowLeft />

                Back

            </button>

        </div>

    );

};

export default OTPVerification;