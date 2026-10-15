import React from "react";
import "./HeroBanner.scss";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HeroBanner = ({ products = [], categoryProducts = [] }) => {
    const { seller, isAuthenticated } = useSelector(state => state.seller);
    const sellerRoute = isAuthenticated ? "/seller/dashboard" : !seller ? "/seller/register" : !seller.email_verified ? "/seller/registration-success" : "/seller/login";
    const showcaseProducts = [...products, ...categoryProducts.flatMap(category => category.products || [])]
        .filter(product => product?.product_id && (product.images?.some(image => image.image_url) || product.product_url || product.image))
        .filter((product, index, all) => all.findIndex(candidate => String(candidate.product_id) === String(product.product_id)) === index)
        .slice(0, 4);

        console.log(products , categoryProducts)
    return (
        <section className="hero-banner">

            <div className="hero-banner__overlay">

                <div className="hero-banner__content">

                    <span className="hero-banner__tag">
                        Welcome to buyRsell Mart
                    </span>

                    <h1 className="hero-banner__title">
                        Discover Amazing Products <br />
                        at the Best Prices
                    </h1>

                    <p className="hero-banner__description">
                        Shop electronics, fashion, home essentials,
                        beauty products and much more from trusted sellers.
                    </p>

                    <div className="hero-banner__buttons">

                        <Link to="/products" className="hero-banner__shop-btn">
                            Shop Now
                            <FaArrowRight />
                        </Link>

                        <Link to={sellerRoute} className="hero-banner__seller-btn">
                            {isAuthenticated ? "Seller Dashboard" : "Become Seller"}
                        </Link>

                    </div>

                </div>

                <div className="hero-banner__showcase" role="group" aria-label="Featured marketplace products">
                    {showcaseProducts.length ? showcaseProducts.map((product, index) => {
                        const image = product.images?.find(item => item.image_url)?.image_url || product.image || product.product_url;
                        return <article className={`hero-banner__product hero-banner__product--${index + 1}`} key={product.product_id}>
                            <img src={image} alt={product.product_name} />
                            <div className="hero-banner__product-info">
                                <span>{product.category_name || product.brand || "Marketplace pick"}</span>
                                <strong>{product.product_name}</strong>
                                {product.selling_price != null && <b>₹{Number(product.selling_price).toLocaleString("en-IN")}</b>}
                            </div>
                        </article>;
                    }) : <div className="hero-banner__showcase-loading" aria-hidden="true">
                        <span className="hero-banner__placeholder hero-banner__placeholder--one" />
                        <span className="hero-banner__placeholder hero-banner__placeholder--two" />
                        <span className="hero-banner__placeholder hero-banner__placeholder--three" />
                        <span className="hero-banner__placeholder hero-banner__placeholder--four" />
                    </div>}
                </div>

            </div>

        </section>
    );
};

export default HeroBanner;
