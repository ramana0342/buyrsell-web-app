import React, { useState } from "react";
import OfferModal from "../../../Customer/Offers/OfferModal";

import "./ProductInfo.scss";

import { useDispatch, useSelector } from "react-redux";

import {
    FaStar,
    FaRegStar,
    FaHeart,
    FaShareAlt,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaBolt,
    FaCheckCircle,
    FaRegHeart
} from "react-icons/fa";

import {
    addProductToWishlist,
    removeProductFromWishlist
} from "../../../../../features/customer/customerWishlistSlice";

import {
    addProductToCartAsync
} from "../../../../../features/customer/customerCartSlice";

const ProductInfo = ({ product, displayOnly = false }) => {


    const {

        product_name,
        brand,
        short_description,

        selling_price,
        original_price,
        discount_percentage,

        stock_quantity,

        average_rating,
        total_reviews

    } = product;



    const [quantity, setQuantity] = useState(1);
    const [offerOpen, setOfferOpen] = useState(false);


    const dispatch = useDispatch();


    const {
        isAuthenticated: customerAuthenticated
    } = useSelector(
        state => state.customer
    );



    const {
        wishlist,
        actionProductId
    } = useSelector(
        state => state.customerWishlist
    );

    const {
        actionLoading: cartActionLoading,
        actionProductId: cartActionProductId
    } = useSelector(
        (state) => state.customerCart
    );



    const isWishlisted = wishlist.some(
        item =>
            item.product_id === product.product_id
    );


    const isWishlistLoading =
        actionProductId === product.product_id;

    const isAddingToCart =
        cartActionLoading &&
        cartActionProductId === product.product_id;



    const handleWishlist = () => {

        if (!customerAuthenticated) {
            window.dispatchEvent(new Event("openCustomerAuthModal"));
            return;
        }

        if (isWishlistLoading) {
            return;
        }


        if (isWishlisted) {

            dispatch(
                removeProductFromWishlist(
                    product.product_id
                )
            );

        } else {

            dispatch(
                addProductToWishlist(
                    product.product_id
                )
            );

        }

    };

    const handleAddToCart = async () => {

        if (!customerAuthenticated) {
            window.dispatchEvent(new Event("openCustomerAuthModal"));
            return;
        }

        if (!product.product_id) {
            return;
        }

        if (stock_quantity <= 0) {
            return;
        }


        try {

            await dispatch(
                addProductToCartAsync({
                    productId: product.product_id,
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

    const handleMakeOffer = () => {
        if (!customerAuthenticated) { window.dispatchEvent(new Event("openCustomerAuthModal")); return; }
        setOfferOpen(true);
    };









    const increaseQuantity = () => {


        if (quantity < stock_quantity) {

            setQuantity(quantity + 1);

        }

    };





    const decreaseQuantity = () => {


        if (quantity > 1) {

            setQuantity(quantity - 1);

        }

    };







    const formattedPrice = Number(
        selling_price
    ).toLocaleString("en-IN");



    const formattedOriginalPrice = Number(
        original_price
    ).toLocaleString("en-IN");







    return (


        <div className="product-info">





            <div className="product-info__header">



                <div className="product-info__brand">


                    {brand}


                </div>





                {!displayOnly && <div className="product-info__actions">


                    <button

                        type="button"

                        className={
                            `wishlist ${isWishlisted
                                ? "active"
                                : ""
                            } ${isWishlistLoading
                                ? "loading"
                                : ""
                            }`
                        }

                        onClick={handleWishlist}

                        disabled={isWishlistLoading}

                    >

                        {
                            isWishlistLoading

                                ?

                                <span className="wishlist-spinner"></span>

                                :

                                isWishlisted

                                    ?

                                    <FaHeart />

                                    :

                                    <FaRegHeart />
                        }

                    </button>


                    {/* <button>

                        <FaShareAlt />

                    </button> */}



                </div>}



            </div>









            <h1 className="product-info__title">


                {product_name}


            </h1>







            <p className="product-info__short-description">


                {short_description}


            </p>









            <div className="product-info__rating">


                {

                    Number(average_rating) > 0

                        ?

                        <>

                            <div className="stars">


                                {

                                    [...Array(5)].map((_, index) => (


                                        index < Math.round(
                                            Number(average_rating)
                                        )

                                            ?

                                            <FaStar key={index} />

                                            :

                                            <FaRegStar key={index} />


                                    ))

                                }


                            </div>



                            <span>

                                {average_rating}

                                ({total_reviews} reviews)

                            </span>


                        </>


                        :

                        <span className="no-review">

                            No reviews yet

                        </span>


                }



            </div>









            <div className="product-info__price-section">


                <div className="current-price">


                    ₹{formattedPrice}


                </div>





                {

                    Number(original_price) > 0 &&


                    <>


                        <div className="old-price">

                            ₹{formattedOriginalPrice}

                        </div>



                        <div className="discount">


                            {discount_percentage}% OFF


                        </div>


                    </>


                }



            </div>









            <div className="product-info__availability">



                {

                    stock_quantity > 0

                        ?

                        <>


                            <FaCheckCircle />


                            <span>

                                In Stock
                                {" "}
                                ({stock_quantity} available)

                            </span>


                        </>


                        :

                        <span className="out-stock">

                            Out of stock

                        </span>


                }



            </div>









            {!displayOnly && <div className="product-info__buy-box">



                {/* <div className="quantity">


                    <button

                        onClick={decreaseQuantity}

                    >

                        <FaMinus />

                    </button>




                    <span>

                        {quantity}

                    </span>




                    <button

                        onClick={increaseQuantity}

                    >

                        <FaPlus />

                    </button>



                </div> */}










                <button
                    type="button"
                    className={`cart-button ${isAddingToCart ? "loading" : ""
                        }`}
                    onClick={handleAddToCart}
                    disabled={
                        isAddingToCart ||
                        stock_quantity <= 0
                    }
                >
                    {isAddingToCart ? (
                        <>
                            <span className="cart-spinner"></span>
                            Adding...
                        </>
                    ) : stock_quantity <= 0 ? (
                        "Out of Stock"
                    ) : (
                        <>
                            <FaShoppingCart />
                            Add to Cart
                        </>
                    )}
                </button>

                <button type="button" className="cart-button" onClick={handleMakeOffer} disabled={stock_quantity <= 0}>
                    Make an Offer
                </button>








                {/* <button className="buy-button">


                    <FaBolt />


                    Buy Now


                </button> */}



            </div>}

            {offerOpen && <OfferModal product={product} initialQuantity={quantity} onClose={() => setOfferOpen(false)} />}






        </div>


    );

};


export default ProductInfo;
