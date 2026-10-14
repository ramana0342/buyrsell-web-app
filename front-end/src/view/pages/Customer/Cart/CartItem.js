import React from "react";

import {
    FaMinus,
    FaPlus,
    FaTrash
} from "react-icons/fa";

import {
    Link
} from "react-router-dom";


const CartItem = ({
    item,
    isLoading,
    onQuantityChange,
    onRemove,
    formatPrice
    , onMakeOffer,
    selectedForOffer,
    onSelectForOffer,
    showCombinedOfferSelection = false
}) => {


    // ==========================================
    // QUANTITY
    // ==========================================

    const quantity =
        Number(item.quantity);


    const stockQuantity =
        Number(item.stock_quantity);


    // ==========================================
    // DECREASE
    // ==========================================

    const handleDecrease = () => {

        onQuantityChange(
            item.product_id,
            quantity,
            stockQuantity,
            "decrease"
        );

    };


    // ==========================================
    // INCREASE
    // ==========================================

    const handleIncrease = () => {

        onQuantityChange(
            item.product_id,
            quantity,
            stockQuantity,
            "increase"
        );

    };


    // ==========================================
    // REMOVE
    // ==========================================

    const handleRemove = () => {

        onRemove(
            item.product_id
        );

    };


    return (

        <article
            className={
                `cart-item ${isLoading
                    ? "loading"
                    : ""
                }`
            }
        >


            {/* ==================================
                PRODUCT
            ================================== */}

            <div className="cart-item__product">


                <Link
                    to={`/product/${item.slug}`}
                    className="cart-item__image"
                >

                    <img
                        src={
                            item.image ||
                            item.product_url
                        }
                        alt={
                            item.product_name
                        }
                    />

                </Link>



                <div className="cart-item__details">

                    {showCombinedOfferSelection && <label className="cart-item__offer-select">
                        <input type="checkbox" checked={selectedForOffer} onChange={event => onSelectForOffer(item.product_id, event.target.checked)} disabled={stockQuantity <= 0 || item.product_status !== "active"} />
                        <span>Select for combined offer</span>
                    </label>}


                    {
                        item.brand && (

                            <span className="cart-item__brand">

                                {item.brand}

                            </span>

                        )
                    }



                    <Link
                        to={`/product/${item.slug}`}
                        className="cart-item__name"
                    >

                        {item.product_name}

                    </Link>



                    {
                        stockQuantity <= 0

                            ?

                            <span className="cart-item__stock cart-item__stock--out">

                                Out of stock

                            </span>

                            :

                            <span className="cart-item__stock">

                                {stockQuantity}{" "}
                                available

                            </span>
                    }


                </div>


            </div>



            {/* ==================================
                PRICE
            ================================== */}

            <div className="cart-item__price">


                <strong>

                    ₹
                    {formatPrice(
                        item.selling_price
                    )}

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
                            {formatPrice(
                                item.original_price
                            )}

                        </del>

                    )
                }


            </div>



            {/* ==================================
                QUANTITY
            ================================== */}

            <div className="cart-item__quantity">


                <button
                    type="button"
                    onClick={
                        handleDecrease
                    }
                    disabled={
                        isLoading ||
                        quantity <= 1
                    }
                    aria-label="Decrease quantity"
                >

                    <FaMinus />

                </button>



                <span>

                    {quantity}

                </span>



                <button
                    type="button"
                    onClick={
                        handleIncrease
                    }
                    disabled={
                        isLoading ||
                        quantity >=
                        stockQuantity
                    }
                    aria-label="Increase quantity"
                >

                    <FaPlus />

                </button>


            </div>



            {/* ==================================
                ITEM TOTAL
            ================================== */}

            <div className="cart-item__total">

                <strong>

                    ₹
                    {formatPrice(
                        item.item_total
                    )}

                </strong>

            </div>



            {/* ==================================
                REMOVE
            ================================== */}

            <div className="cart-item__remove">

                <button type="button" className="cart-offer-button" onClick={() => onMakeOffer(item)} disabled={stockQuantity <= 0}>Make Offer</button>


                <button
                    type="button"
                    onClick={
                        handleRemove
                    }
                    disabled={
                        isLoading
                    }
                    aria-label={
                        `Remove ${item.product_name}`
                    }
                >

                    {
                        isLoading

                            ?

                            <span className="cart-spinner"></span>

                            :

                            <FaTrash />

                    }

                </button>


            </div>


        </article>

    );

};


export default CartItem;
