import React from "react";
import "./ProductGrid.scss";

import ProductCard from "../ProductCard/ProductCard";

const ProductGrid = ({
    title,
    products = [],
    loading = false
}) => {

    return (

        <section className="product-grid">

            <div className="product-grid__header">

                <h2>{title}</h2>

                <button>

                    View All

                </button>

            </div>

            {

                loading ?

                    <div className="product-grid__loading">

                        {

                            [...Array(8)].map((_, index) => (

                                <div
                                    className="product-skeleton"
                                    key={index}
                                >

                                    <div className="product-skeleton__image"></div>

                                    <div className="product-skeleton__line"></div>

                                    <div className="product-skeleton__line short"></div>

                                    <div className="product-skeleton__price"></div>

                                </div>

                            ))

                        }

                    </div>

                    :

                    <div className="product-grid__products">

                        {

                            products.length > 0 ?

                                products.map((product) => (

                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />

                                ))

                                :

                                <div className="product-grid__empty">

                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                                        alt="No Products"
                                    />

                                    <h3>

                                        No Products Found

                                    </h3>

                                    <p>

                                        Products will appear here after sellers upload them.

                                    </p>

                                </div>

                        }

                    </div>

            }

        </section>

    );

};

export default ProductGrid;