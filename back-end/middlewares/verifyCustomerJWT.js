import jwt from "jsonwebtoken";

export const verifyCustomerJWT = (

    req,

    res,

    next

) => {

    const authHeader = req.headers.authorization;

    if (

        !authHeader ||

        !authHeader.startsWith("Bearer ")

    ) {

        return res.status(401).json({

            status: {

                code: 401,

                message: "Authorization token is required"

            },

            response: null

        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        req.customer = decoded;

        next();

    }
    catch {

        return res.status(401).json({

            status: {

                code: 401,

                message: "Invalid or expired access token"

            },

            response: null

        });

    }

};