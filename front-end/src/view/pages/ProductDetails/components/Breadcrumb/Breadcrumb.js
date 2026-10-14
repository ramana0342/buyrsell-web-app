import React from "react";

import "./Breadcrumb.scss";

import {
    FaHome,
    FaChevronRight
} from "react-icons/fa";



const Breadcrumb = ({ product }) => {


    const {

        category_name,
        product_name

    } = product || {};





    return (


        <nav className="product-breadcrumb">





            <div className="product-breadcrumb__item">


                <FaHome />


                <span>

                    Home

                </span>


            </div>







            <FaChevronRight className="product-breadcrumb__arrow" />







            <div className="product-breadcrumb__item">


                <span>

                    {category_name}

                </span>


            </div>








            <FaChevronRight className="product-breadcrumb__arrow" />







            <div className="product-breadcrumb__current">


                {product_name}



            </div>






        </nav>


    );

};


export default Breadcrumb;