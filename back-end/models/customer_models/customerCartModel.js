import pool from "../../config/database.js";


// Get customer's cart
export const getCart = async (customerId) => {

    const query = `

        SELECT

            c.cart_id,
            c.customer_id,
            c.product_id,
            c.quantity,
            c.created_at,
            c.updated_at,

            p.product_name,
            p.seller_id,
            s.business_name AS seller_name,
            p.slug,
            p.product_url,
            p.short_description,
            p.brand,

            p.selling_price,
            p.original_price,
            p.discount_percentage,

            p.stock_quantity,
            p.average_rating,
            p.total_reviews,

            p.featured,
            p.product_status,

            COALESCE(

                (
                    SELECT pi.image_url

                    FROM buy_sell_mart.product_images pi

                    WHERE pi.product_id = p.product_id

                    ORDER BY pi.display_order

                    LIMIT 1

                ),

                p.product_url

            ) AS image,

            (
                c.quantity * p.selling_price
            ) AS item_total

        FROM buy_sell_mart.customer_carts c

        INNER JOIN buy_sell_mart.products p

            ON c.product_id = p.product_id

        LEFT JOIN buy_sell_mart.sellers s

            ON s.seller_id = p.seller_id

        WHERE c.customer_id = $1

        ORDER BY c.created_at DESC;

    `;


    const result = await pool.query(
        query,
        [customerId]
    );


    return result.rows;

};


// Add product to cart
export const addToCart = async (
    customerId,
    productId,
    quantity = 1
) => {

    const query = `

        WITH cart_item AS (

            INSERT INTO buy_sell_mart.customer_carts
            (
                cart_id,
                customer_id,
                product_id,
                quantity
            )

            VALUES
            (
                gen_random_uuid(),
                $1,
                $2,
                $3
            )

            ON CONFLICT (
                customer_id,
                product_id
            )

            DO UPDATE SET

                quantity =
                    buy_sell_mart.customer_carts.quantity
                    + EXCLUDED.quantity,

                updated_at =
                    CURRENT_TIMESTAMP

            RETURNING

                cart_id,
                customer_id,
                product_id,
                quantity,
                created_at,
                updated_at

        )

        SELECT

            c.cart_id,
            c.customer_id,
            c.product_id,
            c.quantity,
            c.created_at,
            c.updated_at,

            p.product_name,
            p.seller_id,
            s.business_name AS seller_name,
            p.slug,
            p.product_url,
            p.short_description,
            p.brand,

            p.selling_price,
            p.original_price,
            p.discount_percentage,

            p.stock_quantity,
            p.average_rating,
            p.total_reviews,

            p.featured,
            p.product_status,

            COALESCE(

                (
                    SELECT pi.image_url

                    FROM buy_sell_mart.product_images pi

                    WHERE pi.product_id = p.product_id

                    ORDER BY pi.display_order

                    LIMIT 1

                ),

                p.product_url

            ) AS image,

            (
                c.quantity * p.selling_price
            ) AS item_total

        FROM cart_item c

        INNER JOIN buy_sell_mart.products p

            ON c.product_id = p.product_id

        LEFT JOIN buy_sell_mart.sellers s

            ON s.seller_id = p.seller_id;

    `;


    const result = await pool.query(
        query,
        [
            customerId,
            productId,
            quantity
        ]
    );


    return result.rows[0];

};


// Update cart quantity
export const updateCartQuantity = async (
    customerId,
    productId,
    quantity
) => {

    const query = `

        WITH updated_cart AS (

            UPDATE buy_sell_mart.customer_carts

            SET
                quantity = $3,
                updated_at = CURRENT_TIMESTAMP

            WHERE customer_id = $1
              AND product_id = $2

            RETURNING
                cart_id,
                customer_id,
                product_id,
                quantity,
                created_at,
                updated_at
        )

        SELECT

            c.cart_id,
            c.customer_id,
            c.product_id,
            c.quantity,
            c.created_at,
            c.updated_at,

            p.product_name,
            p.seller_id,
            s.business_name AS seller_name,
            p.slug,
            p.product_url,
            p.short_description,
            p.brand,

            p.selling_price,
            p.original_price,
            p.discount_percentage,

            p.stock_quantity,
            p.average_rating,
            p.total_reviews,

            p.featured,
            p.product_status,

            COALESCE(

                (
                    SELECT pi.image_url

                    FROM buy_sell_mart.product_images pi

                    WHERE pi.product_id = p.product_id

                    ORDER BY pi.display_order

                    LIMIT 1

                ),

                p.product_url

            ) AS image,

            (
                c.quantity * p.selling_price
            ) AS item_total

        FROM updated_cart c

        INNER JOIN buy_sell_mart.products p

            ON c.product_id = p.product_id

        LEFT JOIN buy_sell_mart.sellers s

            ON s.seller_id = p.seller_id;

    `;


    const result = await pool.query(
        query,
        [
            customerId,
            productId,
            quantity
        ]
    );


    return result.rows[0];

};

// Remove product from cart
export const removeProductFromCart = async (
    customerId,
    productId
) => {

    const query = `

        DELETE FROM buy_sell_mart.customer_carts

        WHERE customer_id = $1
          AND product_id = $2

        RETURNING
            cart_id,
            customer_id,
            product_id,
            quantity,
            created_at,
            updated_at;

    `;


    const result = await pool.query(
        query,
        [
            customerId,
            productId
        ]
    );


    return result.rows[0];

};


// Clear customer's cart
export const clearCart = async (customerId) => {

    const query = `
        DELETE FROM buy_sell_mart.customer_carts

        WHERE customer_id = $1

        RETURNING
            cart_id,
            customer_id,
            product_id;
    `;

    const result = await pool.query(
        query,
        [customerId]
    );

    return result.rows;
};
