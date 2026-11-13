import React, { useEffect, useRef, useState } from "react";
import { useNavigationType, useParams } from "react-router-dom";

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

const cleanText = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();


const ProductDetails = () => {

    const { slug } = useParams();
    const navigationType = useNavigationType();

    const serverProductData = window.__BUYRSELL_INITIAL_PRODUCT__;
    const hasMatchingInitialProduct = serverProductData?.slug === slug
        && serverProductData?.product?.slug === slug
        && serverProductData.product.product_status === "active";
    const [product, setProduct] = useState(() => hasMatchingInitialProduct ? serverProductData.product : null);
    const [relatedProducts, setRelatedProducts] = useState(() => hasMatchingInitialProduct && Array.isArray(serverProductData.relatedProducts)
        ? serverProductData.relatedProducts
        : []);
    const currentProductRef = useRef(product);
    currentProductRef.current = product;

    const [loading, setLoading] = useState(!hasMatchingInitialProduct);
    const [error, setError] = useState("");
    const requestVersion = useRef(0);

    useEffect(() => {
        // The server response already contains product-specific metadata while
        // the original React page loads its product data.
        if (!product && window.__BUYRSELL_INITIAL_PRODUCT__?.slug === slug) return undefined;

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
        if (product?.slug === slug) {
            if (!structured) { structured = document.createElement("script"); structured.id = "product-structured-data"; structured.type = "application/ld+json"; document.head.appendChild(structured); }
            const images = (Array.isArray(product.images) ? product.images : []).map(item => item.image_url).filter(Boolean);
            const description = cleanText(product.short_description || product.description)
                || `${cleanText(product.product_name)} available on buyRsell Mart.`;
            const sellingPrice = Number(product.selling_price);
            const hasPrice = product.selling_price !== null && product.selling_price !== undefined && Number.isFinite(sellingPrice);
            const schema = {
                "@context": "https://schema.org",
                "@type": "Product",
                name: cleanText(product.product_name),
                url: defaults.canonical,
                description,
                ...(images.length ? { image: images } : {})
            };
            if (product.brand) schema.brand = { "@type": "Brand", name: cleanText(product.brand) };
            if (hasPrice) {
                schema.offers = {
                    "@type": "Offer", url: defaults.canonical, priceCurrency: "INR", price: sellingPrice,
                    availability: Number(product.stock_quantity) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                };
            }
            structured.textContent = JSON.stringify(schema);
        } else if (structured) {
            structured.textContent = "";
        }
    }, [product, slug]);

    useEffect(() => () => {
        document.getElementById("product-structured-data")?.remove();
    }, []);



    useEffect(() => {
        const version = ++requestVersion.current;

        if (navigationType !== "POP") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        if (slug) {
            const currentProduct = currentProductRef.current;
            if (currentProduct?.slug === slug && currentProduct.product_status === "active") {
                setError("");
                setLoading(false);
                fetchProduct(slug, version, true);
                return () => { requestVersion.current += 1; };
            }

            setProduct(null);
            setRelatedProducts([]);
            setLoading(true);
            fetchProduct(slug, version);
        }

        return () => { requestVersion.current += 1; };
    }, [slug, navigationType]);





    const fetchProduct = async (id, version, silent = false) => {

        try {

            if (!silent) setLoading(true);
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

                if (!silent) {
                    setProduct(null);
                    setRelatedProducts([]);
                    setError("Product not found");
                }


            }



        }
        catch (error) {

            if (version !== requestVersion.current) return;


            console.error(
                "Product Details Error",
                error
            );


            if (!silent) {
                setProduct(null);
                setRelatedProducts([]);
                setError("Unable to load product details");
            }


        }
        finally {


            if (version === requestVersion.current && !silent) setLoading(false);


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
