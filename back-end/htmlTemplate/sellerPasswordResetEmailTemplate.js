export const sellerPasswordResetEmailTemplate = (
    resetLink
) => {

    return `

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                Reset Your Password
            </title>

        </head>

        <body>

            <div
                style="
                    max-width:600px;
                    margin:auto;
                    padding:30px;
                    font-family:Arial,sans-serif;
                "
            >

                <h2>
                    Reset Your Seller Password
                </h2>

                <p>
                    We received a request to reset the password
                    for your buyRsell Mart seller account.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display:inline-block;
                        padding:12px 24px;
                        background:#000;
                        color:#fff;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>

                <p style="margin-top:25px;">

                    This link will expire in
                    <strong>10 minutes</strong>.

                </p>

                <p>

                    If you did not request a password reset,
                    you can safely ignore this email.

                </p>

                <p>
                    Thanks,<br>
                    buyRsell Mart Team
                </p>

            </div>

        </body>

        </html>

    `;

};