import pool from "../../config/database.js";

export const createCustomer = async (customer) => {

    const result = await pool.query(

        `INSERT INTO buy_sell_mart.customers(

            customer_id,

            full_name,

            email,

            password_hash

        )

        VALUES($1,$2,$3,$4)

        RETURNING

            customer_id,

            full_name,

            email,

            email_verified,

            customer_status,

            created_at`,

        [

            customer.customer_id,

            customer.full_name,

            customer.email,

            customer.password_hash

        ]

    );

    return result.rows[0];

};

export const findCustomerByEmail = async (email) => {

    const result = await pool.query(

        `SELECT *
         FROM buy_sell_mart.customers
         WHERE email = $1`,

        [email]

    );

    return result.rows[0];

};

export const findCustomerById = async (customerId) => {

    const result = await pool.query(

        `SELECT *
         FROM buy_sell_mart.customers
         WHERE customer_id = $1`,

        [customerId]

    );

    return result.rows[0];

};

export const verifyCustomerEmail = async (customerId) => {

    const result = await pool.query(

        `UPDATE buy_sell_mart.customers
         SET

            email_verified = TRUE,

            updated_at = CURRENT_TIMESTAMP

         WHERE customer_id = $1

         RETURNING *`,

        [customerId]

    );

    return result.rows[0];

};

export const updateCustomerPassword = async (
    customerId,
    passwordHash
) => {

    const result = await pool.query(

        `UPDATE buy_sell_mart.customers
         SET
            password_hash = $1,
            updated_at = CURRENT_TIMESTAMP
         WHERE customer_id = $2
         RETURNING
            customer_id,
            full_name,
            email,
            email_verified,
            customer_status`,

        [
            passwordHash,
            customerId
        ]

    );

    return result.rows[0];

};