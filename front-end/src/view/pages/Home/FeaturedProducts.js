import React from "react";
import "./FeaturedProducts.scss";

import ProductCard from "./ProductCard/ProductCard";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ products = [], loading, error, onRetry }) => {

    return (

        !loading && !error && products.length === 0 ? null : <section className="featured-products">

            <div className="featured-products__container">

                <div className="featured-products__header">

                    <div>

                        <span className="featured-products__subtitle">
                            Latest Collection
                        </span>

                        <h2>
                            Featured Products
                        </h2>

                        <p>
                            Explore the latest products from trusted sellers.
                            Discover top brands at the best prices with fast
                            delivery and secure shopping.
                        </p>

                    </div>

                    {products.length > 4 && <Link className="featured-products__view-all" to="/products?featured=true">View All Featured Products</Link>}

                </div>

                {/* Loading */}

                {
                    loading && (

                        <div className="featured-products__loading">

                            Loading Products...

                        </div>

                    )
                }

                {error && !loading && <div className="featured-products__empty">Featured products couldn’t be loaded. <button type="button" onClick={onRetry}>Retry</button></div>}

                {/* Empty */}

                {
                    !loading && !error && products.length === 0 && (

                        <div className="featured-products__empty">

                            No products available.

                        </div>

                    )
                }

                {/* Products */}

                {
                    !loading && products.length > 0 && (

                        <div className="featured-products__grid">

                            {

                            products.slice(0, 4).map((product) => (

                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                    />

                                ))

                            }

                        </div>

                    )
                }

            </div>

        </section>

    );

};

export default FeaturedProducts;
