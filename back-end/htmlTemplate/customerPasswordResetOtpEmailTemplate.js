export const customerPasswordResetOtpEmailTemplate = (
    otp
) => {

    return `

        <div
            style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 30px;
                color: #1f2937;
            "
        >

            <h2
                style="
                    margin-bottom: 10px;
                    color: #2563eb;
                "
            >
                Reset Your Password
            </h2>

            <p>
                We received a request to reset your
                buyRsell Mart account password.
            </p>

            <p>
                Use the OTP below to continue:
            </p>

            <div
                style="
                    margin: 25px 0;
                    padding: 18px;
                    text-align: center;
                    background: #f3f4f6;
                    border-radius: 10px;
                    font-size: 30px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #2563eb;
                "
            >
                ${otp}
            </div>

            <p>
                This OTP will expire in
                <strong>5 minutes</strong>.
            </p>

            <p>
                If you did not request a password reset,
                you can safely ignore this email.
            </p>

            <p>
                Regards,<br>
                buyRsell Mart Team
            </p>

        </div>

    `;

};