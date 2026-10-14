import pool from "../../config/database.js";


// ============================================================
// ADD TO WISHLIST
// ============================================================

export const addToWishlist = async (
    customerId,
    productId
) => {

    const query = `

        WITH inserted_wishlist AS (

            INSERT INTO buy_sell_mart.customer_wishlists
            (
                wishlist_id,
                customer_id,
                product_id
            )

            VALUES
            (
                gen_random_uuid(),
                $1,
                $2
            )

            RETURNING
                wishlist_id,
                customer_id,
                product_id,
                created_at
        )

        SELECT

            w.wishlist_id,
            w.customer_id,
            w.product_id,
            w.created_at,

            p.product_name,
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

            ) AS image

        FROM inserted_wishlist w

        INNER JOIN buy_sell_mart.products p
            ON w.product_id = p.product_id;

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



// ============================================================
// REMOVE FROM WISHLIST
// ============================================================

export const removeFromWishlist = async (
    customerId,
    productId
) => {

    const query = `

        DELETE FROM buy_sell_mart.customer_wishlists

        WHERE customer_id = $1
        AND product_id = $2

        RETURNING
            wishlist_id,
            customer_id,
            product_id;

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



// ============================================================
// GET CUSTOMER WISHLIST
// ============================================================

export const getCustomerWishlist = async (
    customerId
) => {

    const query = `

        SELECT

            w.wishlist_id,
            w.customer_id,
            w.product_id,
            w.created_at,

            p.product_name,
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

            ) AS image

        FROM buy_sell_mart.customer_wishlists w

        INNER JOIN buy_sell_mart.products p
            ON w.product_id = p.product_id

        WHERE w.customer_id = $1

        ORDER BY w.created_at DESC;

    `;


    const result = await pool.query(
        query,
        [
            customerId
        ]
    );


    return result.rows;

};



// ============================================================
// CHECK PRODUCT WISHLIST
// ============================================================

export const isProductWishlisted = async (
    customerId,
    productId
) => {

    const query = `

        SELECT wishlist_id

        FROM buy_sell_mart.customer_wishlists

        WHERE customer_id = $1
        AND product_id = $2

        LIMIT 1;

    `;


    const result = await pool.query(
        query,
        [
            customerId,
            productId
        ]
    );


    return result.rows.length > 0;

};