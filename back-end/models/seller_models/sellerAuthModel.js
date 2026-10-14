import pool from "../../config/database.js";

export const createSeller = async (seller) => {

    const result = await pool.query(

        `INSERT INTO buy_sell_mart.sellers(

            seller_id,

            business_name,

            owner_name,

            email,

            phone,

            password_hash

        )

        VALUES($1,$2,$3,$4,$5,$6)

        RETURNING
            seller_id,
            business_name,
            owner_name,
            email,
            phone,
            email_verified,
            seller_status,
            created_at`,

        [

            seller.seller_id,

            seller.business_name,

            seller.owner_name,

            seller.email,

            seller.phone,

            seller.password_hash

        ]

    );

    return result.rows[0];

};

export const findSellerByEmail = async (email) => {

    const result = await pool.query(

        `SELECT * FROM buy_sell_mart.sellers
        WHERE email=$1`,

        [email]

    );

    return result.rows[0];

};

export const findSellerByPhone = async (phone) => {

    const result = await pool.query(

        `SELECT * FROM buy_sell_mart.sellers
        WHERE phone=$1`,

        [phone]

    );

    return result.rows[0];

};



export const findSellerById = async (sellerId) => {

    const result = await pool.query(

        `SELECT * FROM buy_sell_mart.sellers
        WHERE seller_id=$1`,

        [sellerId]

    );

    return result.rows[0];

};

export const verifySellerEmail = async (sellerId) => {

    const result = await pool.query(

        `UPDATE buy_sell_mart.sellers
        SET
            email_verified = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE seller_id = $1
        RETURNING *`,

        [sellerId]

    );

    return result.rows[0];

};


export const updateSellerPassword = async (
    sellerId,
    passwordHash
) => {

    const result = await pool.query(

        `UPDATE buy_sell_mart.sellers

         SET
            password_hash = $1,
            updated_at = CURRENT_TIMESTAMP

         WHERE seller_id = $2

         RETURNING
            seller_id,
            email`,

        [
            passwordHash,
            sellerId
        ]

    );

    return result.rows[0];

};