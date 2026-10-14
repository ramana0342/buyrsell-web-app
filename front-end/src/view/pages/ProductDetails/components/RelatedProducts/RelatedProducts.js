import React from "react";
import { Link } from "react-router-dom";

import "./RelatedProducts.scss";

import { FaStar, FaArrowRight } from "react-icons/fa";



const RelatedProducts = ({ products = [] }) => {


    if(!products.length){

        return null;

    }






    return (


        <section className="related-products">





            <div className="related-products__header">


                <div>

                    <h2>

                        You May Also Like

                    </h2>


                    <p>

                        Explore more products from this category

                    </p>


                </div>





                <button>


                    View More


                    <FaArrowRight/>


                </button>



            </div>









            <div className="related-products__grid">



                {

                    products.map((product)=>(


                        <Link

                            className="related-products__card"

                            to={`/product/${product.slug}`}

                            aria-label={`View ${product.product_name}`}

                            key={product.product_id}

                        >





                            <div className="related-products__image">


                                <img

                                    src={product.image}

                                    alt={product.product_name}

                                    loading="lazy"

                                />



                                {

                                    Number(product.discount_percentage) > 0 &&

                                    (

                                        <span>


                                            {product.discount_percentage}% OFF


                                        </span>

                                    )

                                }



                            </div>










                            <div className="related-products__content">





                                <h3>

                                    {product.product_name}

                                </h3>







                                <div className="related-products__rating">


                                    {

                                        Number(product.average_rating) > 0

                                        ?

                                        <>


                                            <FaStar/>


                                            <span>

                                                {product.average_rating}

                                            </span>


                                        </>


                                        :

                                        <span>

                                            No ratings

                                        </span>

                                    }



                                </div>









                                <div className="related-products__price">



                                    <strong>

                                        ₹
                                        {
                                            Number(
                                                product.selling_price
                                            )
                                            .toLocaleString(
                                                "en-IN"
                                            )
                                        }

                                    </strong>






                                    {

                                        Number(product.original_price) >

                                        Number(product.selling_price)

                                        &&

                                        (

                                            <del>

                                                ₹
                                                {
                                                    Number(
                                                        product.original_price
                                                    )
                                                    .toLocaleString(
                                                        "en-IN"
                                                    )
                                                }

                                            </del>


                                        )

                                    }



                                </div>






                            </div>






                            <span className="related-products__view">View product <FaArrowRight aria-hidden="true" /></span>
                        </Link>


                    ))

                }



            </div>






        </section>


    );

};


export default RelatedProducts;
