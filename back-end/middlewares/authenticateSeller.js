import jwt from "jsonwebtoken";
export const authenticateSeller = (req, res, next) => {

    try {

        const authorization = req.headers.authorization;

        if (!authorization) {

            return res.status(401).json({

                success: false,
                message: "Authorization token is required."

            });

        }

        const token = authorization.startsWith("Bearer ")
            ? authorization.split(" ")[1]
            : authorization;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.seller = decoded;

        next();

    } catch (error) {

        return res.status(401).json({

            success: false,
            message: "Invalid or expired token."

        });

    }

};