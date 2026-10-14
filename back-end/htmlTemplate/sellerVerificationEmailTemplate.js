export const sellerVerificationEmailTemplate = (verificationLink) => {
  return  `
        <h2>Welcome to buyRsell Mart</h2>

        <p>
            Click the button below to verify your email.
        </p>

        <a
            href="${verificationLink}"
            style="
                padding:12px 25px;
                background:#2563eb;
                color:#fff;
                text-decoration:none;
                border-radius:5px;
            "
        >
            Verify Email
        </a>

        <p>
            This link expires in 5 minutes.
        </p>
    `;
};