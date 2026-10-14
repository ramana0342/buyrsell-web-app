import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "./ProductDetails.scss";

import {
    getProductDetails
} from "../../../network/publicApiService/productService";

import Breadcrumb from "./components/Breadcrumb/Breadcrumb";
import Gallery from "./components/Gallery/Gallery";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import ProductDescription from "./components/ProductDescription/ProductDescription";
import SellerCard from "./components/SellerCard/SellerCard";
import RelatedProducts from "./components/RelatedProducts/RelatedProducts";
import Header from "../../components/Header/Header";


const ProductDetails = () => {

    const { slug } = useParams();


    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const requestVersion = useRef(0);



    useEffect(() => {
        const version = ++requestVersion.current;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (slug) {
            setProduct(null);
            setRelatedProducts([]);
            setLoading(true);
            fetchProduct(slug, version);
        }

        return () => { requestVersion.current += 1; };
    }, [slug]);





    const fetchProduct = async (id, version) => {

        try {

            setLoading(true);
            setError("");


            const response = await getProductDetails(id);

            if (version !== requestVersion.current) return;



            if (response?.status?.success) {


                const productData =
                    response?.response?.product;


                setProduct(productData || null);



                setRelatedProducts(
                    response?.response?.relatedProducts || []
                );


            }
            else {


                setProduct(null);

                setRelatedProducts([]);

                setError(
                    "Product not found"
                );


            }



        }
        catch (error) {

            if (version !== requestVersion.current) return;


            console.error(
                "Product Details Error",
                error
            );


            setProduct(null);

            setRelatedProducts([]);

            setError(
                "Unable to load product details"
            );


        }
        finally {


            if (version === requestVersion.current) setLoading(false);


        }

    };






    if (loading) {


        return (
             <>
            <Header/>

            <section className="product-details-page">


                <div className="product-details-page__container">


                    <div className="loading-card">


                        <div className="loading-card__circle"></div>


                        <h2>
                            Loading Product
                        </h2>


                        <p>
                            Please wait while we prepare product details
                        </p>


                    </div>


                </div>


            </section>
            </>

        );


    }






    if (!product || error) {


        return (
             <>
               <Header />
           
            <section className="product-details-page">


                <div className="product-details-page__container">


                    <div className="empty-card">


                        <h2>
                            Product unavailable
                        </h2>


                        <p>
                            {error}
                        </p>


                    </div>


                </div>


            </section>
              </>

        );


    }





    return (
        <>
            <Header />
            <section className="product-details-page">


                <div className="product-details-page__container">



                    <Breadcrumb
                        product={product}
                    />





                    <section className="product-showcase">



                        <div className="product-showcase__gallery">


                            <Gallery

                                images={
                                    product.images || []
                                }

                                productName={
                                    product.product_name
                                }

                                discount={
                                    product.discount_percentage
                                }

                            />


                        </div>





                        <div className="product-showcase__information">


                            <ProductInfo

                                product={product}

                            />


                        </div>



                    </section>







                    <section className="product-details-layout">



                        <div className="product-details-layout__main">


                            <ProductDescription

                                product={product}

                            />





                            {
                                relatedProducts.length > 0 &&

                                (

                                    <RelatedProducts

                                        products={relatedProducts}

                                    />

                                )

                            }



                        </div>







                        <aside className="product-details-layout__seller">


                            <SellerCard

                                product={product}

                            />


                        </aside>




                    </section>






                </div>


            </section>
        </>

    );


};


export default ProductDetails;
