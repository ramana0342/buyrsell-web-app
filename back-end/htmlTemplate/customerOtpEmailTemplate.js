export const customerOtpEmailTemplate = (otp) => {

    return `

        <div style="font-family:Arial,sans-serif">

            <h2>buyRsell Mart</h2>

            <p>Your email verification code is</p>

            <h1
                style="
                    letter-spacing:8px;
                    color:#0d6efd;
                "
            >
                ${otp}
            </h1>

            <p>This OTP is valid for 5 minutes.</p>

            <p>If you didn't request this, ignore this email.</p>

        </div>

    `;

};