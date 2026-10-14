import jwt from "jsonwebtoken";

export const refreshTokenHandler = async (req, res) => {

    const token = req.cookies.sellerRefreshToken;

    if (!token) {

        return res.status(401).json({

            status: {
                code: 401,
                message: "Refresh token missing"
            },

            response: null

        });

    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(

            {
                sellerId: decoded.sellerId,
                email: decoded.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "10m"
            }

        );

        return res.status(200).json({

            status: {
                code: 200,
                message: "Access token generated successfully"
            },

            response: {
                accessToken : newAccessToken
            }

        });

    }
    catch (error) {

        return res.status(403).json({

            status: {
                code: 403,
                message: "Invalid or expired refresh token"
            },

            response: null

        });

    }

};