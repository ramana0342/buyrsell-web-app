import React from "react";
import "./Wishlist.scss";

import {
    FaHeart,
    FaArrowRight,
    FaBoxOpen,
    FaExclamationCircle
} from "react-icons/fa";

import { Link } from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    removeProductFromWishlist
} from "../../../../features/customer/customerWishlistSlice";

import Header from "../../../components/Header/Header";

import WishlistItem from "./WishlistItem";

const Wishlist = () => {

    const dispatch = useDispatch();


    // ==========================================
    // CUSTOMER AUTH
    // ==========================================

    const {
        isAuthenticated: customerAuthenticated
    } = useSelector(
        state => state.customer
    );


    // ==========================================
    // WISHLIST STATE
    // ==========================================

    const {
        wishlist,
        loading,
        actionLoading,
        actionProductId,
        error
    } = useSelector(
        state => state.customerWishlist
    );


    // ==========================================
    // CART STATE
    // ==========================================

    const {
        actionLoading: cartActionLoading,
        actionProductId: cartActionProductId
    } = useSelector(
        state => state.customerCart
    );


    // ==========================================
    // REMOVE PRODUCT
    // ==========================================

    const handleRemove = (
        productId
    ) => {

        if (
            actionLoading &&
            actionProductId === productId
        ) {
            return;
        }

        dispatch(
            removeProductFromWishlist(
                productId
            )
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <>

                <Header />

                <main className="wishlist-page">

                    <div className="wishlist-page__container">

                        <section className="wishlist-loading">

                            <div className="wishlist-loading__spinner" />

                            <h2>
                                Loading your wishlist
                            </h2>

                            <p>
                                Please wait while we load
                                your saved products.
                            </p>

                        </section>

                    </div>

                </main>

            </>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <>

            <Header />

            <main className="wishlist-page">

                <div className="wishlist-page__container">


                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <header className="wishlist-header">

                        <div className="wishlist-header__content">

                            <div className="wishlist-header__icon">

                                <FaHeart />

                            </div>


                            <div className="wishlist-header__text">

                                <span className="wishlist-header__eyebrow">

                                    YOUR SAVED PRODUCTS

                                </span>


                                <h1>
                                    My Wishlist
                                </h1>


                                <p>
                                    Keep track of the products
                                    you love and come back to
                                    them anytime.
                                </p>

                            </div>

                        </div>


                        {
                            wishlist.length > 0 && (

                                <div className="wishlist-header__count">

                                    <strong>
                                        {wishlist.length}
                                    </strong>

                                    <span>
                                        {
                                            wishlist.length === 1
                                                ? "Item Saved"
                                                : "Items Saved"
                                        }
                                    </span>

                                </div>

                            )
                        }

                    </header>



                    {/* ==========================================
                        ERROR
                    ========================================== */}

                    {
                        error && (

                            <div className="wishlist-error">

                                <FaExclamationCircle />

                                <div>

                                    <strong>
                                        Unable to update wishlist
                                    </strong>

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            </div>

                        )
                    }



                    {/* ==========================================
                        EMPTY WISHLIST
                    ========================================== */}

                    {
                        wishlist.length === 0 ? (

                            <section className="wishlist-empty">

                                <div className="wishlist-empty__illustration">

                                    <div className="wishlist-empty__heart">

                                        <FaHeart />

                                    </div>

                                    <div className="wishlist-empty__box">

                                        <FaBoxOpen />

                                    </div>

                                </div>


                                <h2>
                                    Your wishlist is empty
                                </h2>


                                <p>
                                    You haven't saved any products yet.
                                    Start exploring and save products
                                    you would like to buy later.
                                </p>


                                <Link
                                    to="/"
                                    className="wishlist-empty__button"
                                >

                                    Explore Products

                                    <FaArrowRight />

                                </Link>

                            </section>

                        ) : (

                            <section className="wishlist-content">


                                {/* ==================================
                                    TOOLBAR
                                ================================== */}

                                <div className="wishlist-toolbar">

                                    <div>

                                        <h2>
                                            Saved Products
                                        </h2>

                                        <span>

                                            {wishlist.length}{" "}

                                            {
                                                wishlist.length === 1
                                                    ? "product"
                                                    : "products"
                                            }

                                        </span>

                                    </div>


                                    <span className="wishlist-toolbar__note">

                                        Your newest saves appear first

                                    </span>

                                </div>



                                {/* ==================================
                                    PRODUCT LIST
                                ================================== */}

                                <div className="wishlist-list">

                                    {
                                        wishlist.map(
                                            item => (

                                                <WishlistItem
                                                    key={
                                                        item.wishlist_id
                                                    }

                                                    item={item}

                                                    customerAuthenticated={
                                                        customerAuthenticated
                                                    }

                                                    actionLoading={
                                                        actionLoading
                                                    }

                                                    actionProductId={
                                                        actionProductId
                                                    }

                                                    cartActionLoading={
                                                        cartActionLoading
                                                    }

                                                    cartActionProductId={
                                                        cartActionProductId
                                                    }

                                                    onRemove={
                                                        handleRemove
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </div>

                            </section>

                        )
                    }

                </div>

            </main>

        </>

    );

};

export default Wishlist;