import React from "react";

import "./ProductDescription.scss";

import {
    FaBoxOpen,
    FaTag,
    FaShieldAlt,
    FaInfoCircle
} from "react-icons/fa";



const ProductDescription = ({ product }) => {


    const {

        description,
        category_name,
        brand,
        sku,
        product_status

    } = product;





    const descriptionPoints =
        description
            ?.split("\n")
            ?.filter(
                item => item.trim()
            ) || [];







    return (


        <section className="product-description">





            <div className="product-description__header">


                <h2>

                    Product Details

                </h2>


                <p>

                    Complete information about this product

                </p>


            </div>









            <div className="product-description__content">





                <div className="product-description__story">



                    {

                        descriptionPoints?.map(
                            (text, index) => (

                                <p key={index}>

                                    {text}

                                </p>

                            )

                        )

                    }



                </div>









                <div className="product-description__highlights">





                    <div className="product-description__item">


                        <FaTag />


                        <div>

                            <span>
                                Category
                            </span>


                            <strong>
                                {category_name}
                            </strong>

                        </div>


                    </div>







                    <div className="product-description__item">


                        <FaBoxOpen />


                        <div>

                            <span>
                                Brand
                            </span>


                            <strong>
                                {brand}
                            </strong>

                        </div>


                    </div>








                    <div className="product-description__item">


                        <FaShieldAlt />


                        <div>

                            <span>
                                Status
                            </span>


                            <strong>
                                {
                                    product_status
                                        ?.replace(
                                            "_",
                                            " "
                                        )
                                }
                            </strong>

                        </div>


                    </div>








                    {

                        sku &&

                        (

                            <div className="product-description__item">


                                <FaInfoCircle />


                                <div>

                                    <span>
                                        SKU
                                    </span>


                                    <strong>
                                        {sku}
                                    </strong>

                                </div>


                            </div>

                        )

                    }





                </div>





            </div>






        </section>


    );

};


export default ProductDescription;