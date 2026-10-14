import React from "react";

import {
    FaHeart,
    FaShoppingCart,
    FaStar,
    FaArrowRight,
    FaTrash
} from "react-icons/fa";

import {
    Link
} from "react-router-dom";

import {
    useDispatch
} from "react-redux";

import {
    addProductToCartAsync
} from "../../../../features/customer/customerCartSlice";


const WishlistItem = ({
    item,
    customerAuthenticated,
    actionLoading,
    actionProductId,
    cartActionLoading,
    cartActionProductId,
    onRemove
}) => {

    const dispatch = useDispatch();


    // ==========================================
    // REMOVE LOADING
    // ==========================================

    const isRemoving =
        actionLoading &&
        actionProductId === item.product_id;


    // ==========================================
    // STOCK
    // ==========================================

    const isInStock =
        Number(
            item.stock_quantity
        ) > 0;


    // ==========================================
    // DISCOUNT
    // ==========================================

    const hasDiscount =
        Number(
            item.discount_percentage
        ) > 0;


    // ==========================================
    // ADD TO CART LOADING
    // ==========================================

    const isAddingToCart =
        cartActionLoading &&
        cartActionProductId === item.product_id;


    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async () => {

        if (!customerAuthenticated) {
            return;
        }

        if (!item.product_id) {
            return;
        }

        if (!isInStock) {
            return;
        }

        if (isAddingToCart) {
            return;
        }


        try {

            await dispatch(
                addProductToCartAsync({
                    productId: item.product_id,
                    quantity: 1
                })
            ).unwrap();

        } catch (error) {

            console.error(
                "Add To Cart Error:",
                error
            );

        }

    };


    // ==========================================
    // REMOVE
    // ==========================================

    const handleRemove = () => {

        if (isRemoving) {
            return;
        }

        onRemove(
            item.product_id
        );

    };


    // ==========================================
    // CARD
    // ==========================================

    return (

        <article
            className={
                `wishlist-card ${
                    isRemoving
                        ? "is-removing"
                        : ""
                }`
            }
        >


            {/* ==================================
                IMAGE
            ================================== */}

            <div className="wishlist-card__media">


                <Link
                    to={`/product/${item.slug}`}
                    className="wishlist-card__image-link"
                >

                    <img
                        src={
                            item.image ||
                            item.product_url
                        }
                        alt={
                            item.product_name
                        }
                        loading="lazy"
                    />

                </Link>


                {/* DISCOUNT */}

                {
                    hasDiscount && (

                        <span className="wishlist-card__discount">

                            {item.discount_percentage}% OFF

                        </span>

                    )
                }


                {/* HEART / REMOVE */}

                <button
                    type="button"
                    className="wishlist-card__heart"
                    onClick={
                        handleRemove
                    }
                    disabled={
                        isRemoving
                    }
                    aria-label={
                        `Remove ${item.product_name} from wishlist`
                    }
                >

                    {
                        isRemoving

                            ?

                            <span className="wishlist-card__spinner" />

                            :

                            <FaHeart />

                    }

                </button>

            </div>



            {/* ==================================
                PRODUCT BODY
            ================================== */}

            <div className="wishlist-card__body">


                {/* ==================================
                    TOP
                ================================== */}

                <div className="wishlist-card__top">


                    {
                        item.brand && (

                            <span className="wishlist-card__brand">

                                {item.brand}

                            </span>

                        )
                    }


                    <span
                        className={
                            `wishlist-card__status ${
                                isInStock
                                    ? "wishlist-card__status--available"
                                    : "wishlist-card__status--out"
                            }`
                        }
                    >

                        <span />

                        {
                            isInStock
                                ? "In Stock"
                                : "Out of Stock"
                        }

                    </span>

                </div>



                {/* ==================================
                    TITLE
                ================================== */}

                <Link
                    to={`/product/${item.slug}`}
                    className="wishlist-card__title"
                >

                    <h2>

                        {item.product_name}

                    </h2>

                </Link>



                {/* ==================================
                    DESCRIPTION
                ================================== */}

                {
                    item.short_description && (

                        <p className="wishlist-card__description">

                            {item.short_description}

                        </p>

                    )
                }



                {/* ==================================
                    RATING
                ================================== */}

                <div className="wishlist-card__rating">

                    <span>

                        <FaStar />

                        {
                            Number(
                                item.average_rating || 0
                            ).toFixed(1)
                        }

                    </span>


                    <span className="wishlist-card__reviews">

                        {
                            Number(
                                item.total_reviews || 0
                            ).toLocaleString(
                                "en-IN"
                            )
                        }

                        {" "}

                        Reviews

                    </span>

                </div>



                {/* ==================================
                    PRICE
                ================================== */}

                <div className="wishlist-card__pricing">


                    <strong>

                        ₹
                        {
                            Number(
                                item.selling_price
                            ).toLocaleString(
                                "en-IN"
                            )
                        }

                    </strong>


                    {
                        Number(
                            item.original_price
                        ) >
                        Number(
                            item.selling_price
                        ) && (

                            <del>

                                ₹
                                {
                                    Number(
                                        item.original_price
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                }

                            </del>

                        )
                    }


                    {
                        hasDiscount && (

                            <span>

                                Save{" "}

                                {
                                    item.discount_percentage
                                }%

                            </span>

                        )
                    }

                </div>



                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="wishlist-card__actions">


                    {/* ADD TO CART */}

                    {
                        isInStock && (

                            <button
                                type="button"
                                className={
                                    `wishlist-card__cart ${
                                        isAddingToCart
                                            ? "loading"
                                            : ""
                                    }`
                                }
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    isAddingToCart
                                }
                            >

                                {
                                    isAddingToCart

                                        ?

                                        <>

                                            <span className="cart-spinner" />

                                            Adding...

                                        </>

                                        :

                                        <>

                                            <FaShoppingCart />

                                            Add to Cart

                                        </>

                                }

                            </button>

                        )
                    }



                    {/* VIEW PRODUCT */}

                    <Link
                        to={`/product/${item.slug}`}
                        className="wishlist-card__view"
                    >

                        View Product

                        <FaArrowRight />

                    </Link>



                    {/* DELETE */}

                    <button
                        type="button"
                        className="wishlist-card__delete"
                        onClick={
                            handleRemove
                        }
                        disabled={
                            isRemoving
                        }
                        aria-label={
                            `Delete ${item.product_name}`
                        }
                    >

                        {
                            isRemoving

                                ?

                                <span className="wishlist-card__spinner" />

                                :

                                <FaTrash />

                        }

                    </button>

                </div>

            </div>

        </article>

    );

};


export default WishlistItem;