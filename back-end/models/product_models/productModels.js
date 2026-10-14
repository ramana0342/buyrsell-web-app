import pool from "../../config/database.js";


const getAllProducts = async ({ search = "", category = "", featured = false, excludeFeatured = false, limit = 100, offset = 0 } = {}) => {

    const query = `

        SELECT

            p.product_id,
            p.seller_id,
            p.category_id,
            p.product_name,
            p.slug,
            p.product_url,
            p.short_description,
            p.description,
            p.brand,
            p.sku,
            p.selling_price,
            p.original_price,
            p.discount_percentage,
            p.gst_percentage,
            p.stock_quantity,
            p.minimum_stock_alert,
            p.average_rating,
            p.total_reviews,
            p.product_status,
            p.featured,
            p.created_at,
            p.updated_at,

            c.category_name,
            COUNT(*) OVER () AS total_count,

            COALESCE(

                json_agg(

                    json_build_object(

                        'image_id', pi.image_id,
                        'image_url', pi.image_url,
                        'public_id', pi.public_id,
                        'display_order', pi.display_order,
                        'created_at', pi.created_at

                    )

                    ORDER BY pi.display_order

                ) FILTER (WHERE pi.image_id IS NOT NULL),

                '[]'

            ) AS images

        FROM buy_sell_mart.products p

        LEFT JOIN buy_sell_mart.categories c
        ON c.category_id = p.category_id

        LEFT JOIN buy_sell_mart.product_images pi
        ON pi.product_id = p.product_id

        WHERE p.product_status = 'active'
          AND ($1 = '' OR p.product_name ILIKE '%' || $1 || '%' OR COALESCE(p.brand, '') ILIKE '%' || $1 || '%' OR COALESCE(p.description, '') ILIKE '%' || $1 || '%' OR COALESCE(c.category_name, '') ILIKE '%' || $1 || '%')
          AND ($2 = '' OR LOWER(p.category_id::text) = LOWER($2) OR LOWER(c.category_name) = LOWER($2))
          AND (NOT $3::boolean OR p.featured = true)
          AND (NOT $6::boolean OR p.featured = false)

        GROUP BY

            p.product_id,
            c.category_name

        ORDER BY p.created_at DESC
        LIMIT $4 OFFSET $5;

    `;

    const result = await pool.query(query, [search, category, featured, limit, offset, excludeFeatured]);

    return result.rows;

};

const getHomepageCategoryProducts = async () => {
    const query = `
        WITH grouped_products AS (
            SELECT p.product_id, p.category_id, p.seller_id, p.product_name, p.slug, p.product_url,
                p.short_description, p.description, p.brand, p.sku, p.selling_price, p.original_price,
                p.discount_percentage, p.gst_percentage, p.stock_quantity, p.minimum_stock_alert,
                p.average_rating, p.total_reviews, p.product_status, p.featured, p.created_at, p.updated_at,
                c.category_name,
                COALESCE(json_agg(json_build_object(
                    'image_id', pi.image_id, 'image_url', pi.image_url, 'public_id', pi.public_id,
                    'display_order', pi.display_order, 'created_at', pi.created_at
                ) ORDER BY pi.display_order) FILTER (WHERE pi.image_id IS NOT NULL), '[]') AS images
            FROM buy_sell_mart.products p
            LEFT JOIN buy_sell_mart.categories c ON c.category_id = p.category_id
            LEFT JOIN buy_sell_mart.product_images pi ON pi.product_id = p.product_id
            WHERE p.product_status = 'active' AND p.featured = false
              AND LOWER(p.category_id::text) IN ('electronics', 'fashion', 'home', 'grocery')
            GROUP BY p.product_id, c.category_name
        ), ranked_products AS (
            SELECT grouped_products.*,
                COUNT(*) OVER (PARTITION BY category_id) AS category_total,
                ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at DESC) AS category_rank
            FROM grouped_products
        )
        SELECT * FROM ranked_products WHERE category_rank <= 5 ORDER BY category_name, created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

const getPublicProductBySlug = async (slug) => {

    const query = `
        SELECT

            p.product_id,
            p.product_name,
            p.slug,
            p.product_url,
            p.short_description,
            p.description,
            p.brand,
            p.sku,

            p.selling_price,
            p.original_price,
            p.discount_percentage,

            p.stock_quantity,
            p.average_rating,
            p.total_reviews,

            p.featured,
            p.product_status,

            p.created_at,

            c.category_id,
            c.category_name,

            s.seller_id,
s.business_name,
s.owner_name,

            COALESCE(

                json_agg(

                    DISTINCT jsonb_build_object(

                        'image_id',pi.image_id,
                        'image_url',pi.image_url,
                        'display_order',pi.display_order

                    )

                ) FILTER (WHERE pi.image_id IS NOT NULL),

                '[]'

            ) AS images

        FROM buy_sell_mart.products p

        LEFT JOIN buy_sell_mart.categories c
            ON c.category_id=p.category_id

        LEFT JOIN buy_sell_mart.sellers s
            ON s.seller_id=p.seller_id

        LEFT JOIN buy_sell_mart.product_images pi
            ON pi.product_id=p.product_id

        WHERE

            p.slug = $1

        AND

            p.product_status='active'

        GROUP BY

            p.product_id,
            c.category_id,
            c.category_name,
            s.seller_id;
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {

        return null;

    }

    const product = result.rows[0];

    const relatedQuery = `

        SELECT

            p.product_id,
            p.product_name,
            p.slug,
            p.selling_price,
            p.original_price,
            p.discount_percentage,
            p.average_rating,

            (

                SELECT image_url

                FROM buy_sell_mart.product_images

                WHERE product_id=p.product_id

                ORDER BY display_order

                LIMIT 1

            ) AS image

        FROM buy_sell_mart.products p

        WHERE

            p.category_id=$1

        AND

            p.product_status='active'

        AND

            p.product_id<>$2

        ORDER BY RANDOM()

        LIMIT 8;

    `;

    const relatedProducts = await pool.query(

        relatedQuery,

        [

            product.category_id,

            product.product_id

        ]

    );

    return {

        product,

        relatedProducts: relatedProducts.rows

    };

};

export {
    getAllProducts,
    getHomepageCategoryProducts,
    getPublicProductBySlug
};
