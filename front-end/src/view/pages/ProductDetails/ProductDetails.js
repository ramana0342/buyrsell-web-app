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
        const defaults = {
            title: "buyRsell Mart | Shop from trusted sellers",
            description: "Discover products from trusted sellers on buyRsell Mart.",
            canonical: `https://buyrsell.vercel.app/product/${slug || ""}`
        };
        document.title = product ? `${product.product_name}${product.brand ? ` by ${product.brand}` : ""} | buyRsell Mart` : defaults.title;
        const setMeta = (selector, attribute, value, create = false) => {
            let element = document.head.querySelector(selector);
            if (!element && create) { element = document.createElement("meta"); document.head.appendChild(element); }
            if (element) element.setAttribute(attribute, value);
        };
        setMeta('meta[name="description"]', "content", product ? (product.short_description || product.description || `${product.product_name} available on buyRsell Mart.`).slice(0, 160) : defaults.description);
        setMeta('meta[property="og:title"]', "content", document.title);
        setMeta('meta[property="og:description"]', "content", product?.short_description || product?.description || defaults.description);
        setMeta('meta[property="og:url"]', "content", defaults.canonical);
        setMeta('meta[name="twitter:title"]', "content", document.title);
        setMeta('link[rel="canonical"]', "href", defaults.canonical);
        let structured = document.getElementById("product-structured-data");
        if (product) {
            if (!structured) { structured = document.createElement("script"); structured.id = "product-structured-data"; structured.type = "application/ld+json"; document.head.appendChild(structured); }
            const image = product.images?.[0]?.image_url;
            const schema = { "@context": "https://schema.org", "@type": "Product", name: product.product_name, url: defaults.canonical };
            if (product.brand) schema.brand = { "@type": "Brand", name: product.brand };
            if (product.description || product.short_description) schema.description = product.description || product.short_description;
            if (image) schema.image = [image];
            if (product.selling_price != null) {
                schema.offers = { "@type": "Offer", url: defaults.canonical, priceCurrency: "INR", price: Number(product.selling_price) };
                if (product.stock_quantity != null) schema.offers.availability = Number(product.stock_quantity) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
            }
            structured.textContent = JSON.stringify(schema);
        } else if (structured) structured.remove();
        return () => { const script = document.getElementById("product-structured-data"); if (script) script.remove(); };
    }, [product, slug]);



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


                    <div className="product-details-skeleton" role="status" aria-label="Loading product details"><div className="product-details-skeleton__image"/><div className="product-details-skeleton__info"><i/><i/><i/><i/><i/></div></div>


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
