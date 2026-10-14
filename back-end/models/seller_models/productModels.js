import pool from "../../config/database.js";
// =============================
// Create Product
// =============================

const createProduct = async (product) => {

    const query = `

        INSERT INTO buy_sell_mart.products (

            product_id,

            seller_id,

            category_id,

            product_name,

            slug,

    product_url,

            short_description,

            description,

            brand,

            sku,

            selling_price,

            original_price,

            discount_percentage,

            gst_percentage,

            stock_quantity,

            minimum_stock_alert,

            product_status,

            featured

        )

        VALUES(

$1,$2,$3,$4,$5,$6,

$7,$8,$9,$10,$11,$12,

$13,$14,$15,$16,$17,$18
)

    `;

    await pool.query(query, [

        product.productId,

        product.sellerId,

        product.categoryId,

        product.productName,

        product.slug,

        product.productUrl,

        product.shortDescription,

        product.description,

        product.brand,

        product.sku,

        product.sellingPrice,

        product.originalPrice,

        product.discountPercentage,

        product.gstPercentage,

        product.stockQuantity,

        product.minimumStockAlert,

        product.product_status,

        product.featured

    ]);

};



// =============================
// Add Product Images
// =============================

const addProductImage = async (image) => {

    const query = `

        INSERT INTO buy_sell_mart.product_images (

            image_id,
            product_id,
            image_url,
            public_id,
            display_order

        )

        VALUES ($1,$2,$3,$4,$5)

    `;

    await pool.query(query, [

        image.imageId,
        image.productId,
        image.imageUrl,
        image.publicId,
        image.displayOrder

    ]);

};



// =============================
// Seller Product List
// =============================

const getSellerProducts = async (sellerId, search = "", limit = 10, offset = 0) => {

    const query = `

        SELECT

            p.product_id,

            p.product_name,
            p.slug,

            p.selling_price,

            p.stock_quantity,

            p.product_status,

            p.created_at,

            c.category_name,

            (

                SELECT image_url

                FROM buy_sell_mart.product_images pi

                WHERE pi.product_id = p.product_id

                ORDER BY display_order

                LIMIT 1

            ) AS product_image

        FROM buy_sell_mart.products p

        LEFT JOIN buy_sell_mart.categories c

        ON p.category_id=c.category_id

        WHERE p.seller_id=$1
          AND ($2 = '' OR p.product_name ILIKE '%' || $2 || '%'
               OR COALESCE(c.category_name, '') ILIKE '%' || $2 || '%'
               OR COALESCE(p.sku, '') ILIKE '%' || $2 || '%')

        ORDER BY p.created_at DESC
        LIMIT $3 OFFSET $4

    `;

    const result = await pool.query(query, [sellerId, search, limit, offset]);

    return result.rows;

};

const countSellerProducts = async (sellerId, search = "") => {
    const result = await pool.query(`
        SELECT COUNT(*)::int AS total
        FROM buy_sell_mart.products p
        LEFT JOIN buy_sell_mart.categories c ON c.category_id = p.category_id
        WHERE p.seller_id=$1
          AND ($2 = '' OR p.product_name ILIKE '%' || $2 || '%'
               OR COALESCE(c.category_name, '') ILIKE '%' || $2 || '%'
               OR COALESCE(p.sku, '') ILIKE '%' || $2 || '%')
    `, [sellerId, search]);
    return result.rows[0].total;
};

const getSellerProductStats = async (sellerId) => {
    const result = await pool.query(`
        SELECT
            COUNT(*)::int AS total_products,
            COUNT(*) FILTER (WHERE product_status = 'active')::int AS active_products,
            COUNT(*) FILTER (WHERE stock_quantity = 0)::int AS out_of_stock_products
        FROM buy_sell_mart.products
        WHERE seller_id = $1
    `, [sellerId]);
    return result.rows[0];
};



// =============================
// Get Single Product
// =============================

const getProductById = async (

    productId,

    sellerId

) => {

    const productQuery = `

        SELECT p.*, c.category_name

        FROM buy_sell_mart.products p
        LEFT JOIN buy_sell_mart.categories c ON c.category_id = p.category_id

        WHERE

            p.product_id=$1

        AND

            p.seller_id=$2

    `;

    const imageQuery = `

        SELECT *

        FROM buy_sell_mart.product_images

        WHERE product_id=$1

        ORDER BY display_order

    `;

    const product = await pool.query(

        productQuery,

        [

            productId,

            sellerId

        ]

    );

    if (!product.rows[0]) return null;

    const images = await pool.query(

        imageQuery,

        [

            productId

        ]

    );

    return {

        product: product.rows[0],

        images: images.rows

    };

};



// =============================
// Update Product
// =============================

const updateProduct = async (

    productId,

    sellerId,

    product

) => {

    const query = `

        UPDATE buy_sell_mart.products

        SET

            category_id=$1,

            product_name=$2,

            short_description=$3,

            description=$4,

            brand=$5,

            sku=$6,

            selling_price=$7,

            original_price=$8,

            discount_percentage=$9,

            gst_percentage=$10,

            stock_quantity=$11,

            minimum_stock_alert=$12,

            product_status=$13,

            featured=$14,

            updated_at=NOW()

        WHERE

            product_id=$15

        AND

            seller_id=$16

    `;

    const result = await pool.query(query, [

        product.categoryId,

        product.productName,

        product.shortDescription,

        product.description,

        product.brand,

        product.sku,

        product.sellingPrice,

        product.originalPrice,

        product.discountPercentage,

        product.gstPercentage,

        product.stockQuantity,

        product.minimumStockAlert,

        product.productStatus,

        product.featured,

        productId,

        sellerId

    ]);

    return result.rowCount > 0;

};



// =============================
// Delete Product Images
// =============================

const deleteProductImages = async (

    productId

) => {

    const result = await pool.query(

        `

        DELETE

        FROM buy_sell_mart.product_images

        WHERE product_id=$1

        `,

        [

            productId

        ]

    );

    return result.rowCount > 0;

};



// =============================
// Delete Product
// =============================

const deleteProduct = async (

    productId,

    sellerId

) => {

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const owned = await client.query(
            "SELECT product_id FROM buy_sell_mart.products WHERE product_id=$1 AND seller_id=$2 FOR UPDATE",
            [productId, sellerId]
        );
        if (!owned.rowCount) {
            await client.query("ROLLBACK");
            return { notFound: true };
        }
        const references = await client.query(`
            SELECT EXISTS (SELECT 1 FROM buy_sell_mart.customer_carts WHERE product_id=$1)
                OR EXISTS (SELECT 1 FROM buy_sell_mart.customer_wishlists WHERE product_id=$1) AS referenced
        `, [productId]);
        if (references.rows[0]?.referenced) {
            await client.query("ROLLBACK");
            return { referenced: true };
        }
        await client.query("DELETE FROM buy_sell_mart.product_images WHERE product_id=$1", [productId]);
        await client.query("DELETE FROM buy_sell_mart.products WHERE product_id=$1 AND seller_id=$2", [productId, sellerId]);
        await client.query("COMMIT");
        return { deleted: true };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }

};

const getProductImages = async (productId) => {

    const result = await pool.query(

        `

        SELECT *

        FROM buy_sell_mart.product_images

        WHERE product_id=$1

        ORDER BY display_order

        `,

        [productId]

    );

    return result.rows;

};

const deleteProductImage = async (imageId) => {

    await pool.query(

        `

        DELETE

        FROM buy_sell_mart.product_images

        WHERE image_id=$1

        `,

        [imageId]

    );

};

export {
    createProduct,
    addProductImage,
    getSellerProducts,
    countSellerProducts,
    getSellerProductStats,
    getProductById,
    updateProduct,
    deleteProductImages,
    deleteProduct,
    getProductImages,
    deleteProductImage
};
