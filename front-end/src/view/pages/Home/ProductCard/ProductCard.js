
import React from "react";
import "./ProductCard.scss";

import {
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
    FaStar,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import {
    Swiper,
    SwiperSlide
} from "swiper/react";

import {
    Navigation,
    Pagination
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    addProductToWishlist,
    removeProductFromWishlist
} from "../../../../features/customer/customerWishlistSlice";

import {
    addProductToCartAsync
} from "../../../../features/customer/customerCartSlice";


const ProductCard = ({ product }) => {


    const {

        product_name,
        slug,
        brand,
        selling_price,
        original_price,
        discount_percentage,
        average_rating,
        total_reviews,
        stock_quantity,
        category_name,
        images = []

    } = product;



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


    const isAddingToCart =
        cartActionLoading &&
        cartActionProductId === product.product_id;

    const isWishlistLoading =
        actionProductId === product.product_id;



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




    return (

        <article className="market-card">


            {/* IMAGE */}

            <div className="market-card__image">


                <Link to={`/product/${slug}`}>

                    <Swiper

                        modules={[
                            Navigation,
                            Pagination
                        ]}

                        navigation={
                            images.length > 1
                        }

                        pagination={
                            images.length > 1
                                ? {
                                    clickable: true
                                }
                                : false
                        }

                        loop={
                            images.length > 1
                        }

                        speed={400}

                        className="product-slider"
                    >

                        {
                            images.map((img) => (

                                <SwiperSlide
                                    key={img.image_id}
                                >

                                    <img
                                        src={img.image_url}
                                        alt={product_name}
                                    />

                                </SwiperSlide>

                            ))
                        }

                    </Swiper>

                </Link>



                {
                    discount_percentage > 0 &&

                    <div className="discount">

                        {discount_percentage}% OFF

                    </div>
                }



                {/* WISHLIST */}

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


            </div>





            {/* DETAILS */}

            <div className="market-card__body">



                <span className="category">

                    {category_name}

                </span>



                <Link
                    className="title"
                    to={`/product/${slug}`}
                >

                    <h3>

                        {product_name}

                    </h3>

                </Link>




                <p className="brand">

                    {brand}

                </p>





                {/* RATING */}

                <div className="rating">


                    <span>

                        <FaStar />

                        {Number(
                            average_rating
                        ).toFixed(1)}

                    </span>


                    <small>

                        ({total_reviews} Reviews)

                    </small>


                </div>





                {/* PRICE */}

                <div className="price">


                    <strong>

                        ₹
                        {Number(
                            selling_price
                        ).toLocaleString("en-IN")}

                    </strong>


                    {
                        original_price &&

                        <del>

                            ₹
                            {Number(
                                original_price
                            ).toLocaleString("en-IN")}

                        </del>
                    }


                </div>




                {/* DELIVERY */}

                <div className="delivery">


                    {
                        stock_quantity > 0

                            ?

                            <>

                                <span className="available">

                                    ✓ In Stock

                                </span>


                                <span>

                                    Free Delivery

                                </span>

                            </>

                            :

                            <span className="out">

                                Out of Stock

                            </span>

                    }


                </div>





                {/* ACTION */}

                <div className="actions">


                    <button
                        type="button"
                        className={`cart ${isAddingToCart ? "loading" : ""
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



                    <Link
                        className="view-btn"
                        to={`/product/${slug}`}
                    >

                        View More

                    </Link>


                </div>



            </div>



        </article>

    );

};


export default ProductCard;
