import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import ProductCard from "../Home/ProductCard/ProductCard";
import { getAllProducts } from "../../../network/publicApiService/productService";
import "./ProductSearchResults.scss";
import { ProductCardSkeleton } from "../../components/Skeletons/Skeletons";

const ProductSearchResults = () => {
    const [params] = useSearchParams();
    const search = params.get("search") || "";
    const category = params.get("category") || "";
    const featured = params.get("featured") === "true";
    const excludeFeatured = params.get("excludeFeatured") === "true";
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [state, setState] = useState("loading");

    useEffect(() => {
        let active = true;
        setState("loading");
        getAllProducts({ search, category, featured, excludeFeatured, limit: 24, offset: 0 }).then(result => { if (active) { setProducts(result?.response || []); setTotal(result?.total || 0); setState("ready"); } })
            .catch(() => { if (active) setState("error"); });
        return () => { active = false; };
    }, [search, category, featured, excludeFeatured]);

    const categoryNames = { electronics: "Electronics", fashion: "Fashion", home: "Home & Kitchen", grocery: "Grocery" };
    const title = featured ? "Featured Products" : category ? (products[0]?.category_name || categoryNames[category.toLowerCase()] || category) : search ? `Results for “${search}”` : "All Products";
    const retry = () => { setState("loading"); getAllProducts({ search, category, featured, excludeFeatured, limit: 24, offset: 0 }).then(result => { setProducts(result?.response || []); setTotal(result?.total || 0); setState("ready"); }).catch(() => setState("error")); };
    const loadMore = () => getAllProducts({ search, category, featured, excludeFeatured, limit: 24, offset: products.length }).then(result => { setProducts(current => [...current, ...(result?.response || [])]); setTotal(result?.total || total); }).catch(() => setState("error"));

    return <><Header /><main className="product-results">
        <div className="product-results__heading"><div><p>buyRsell Mart</p><h1>{title}</h1>{state === "ready" && <span>{total} {total === 1 ? "product" : "products"}</span>}</div><Link className="product-results__browse" to="/products">Browse all products<FaArrowRight aria-hidden="true" /></Link></div>
        {state === "loading" && <ProductCardSkeleton count={8} />}
        {state === "error" && <div className="product-results__state"><h2>Products couldn’t be loaded</h2><p>Please check your connection and try again.</p><button onClick={retry}>Retry</button></div>}
        {state === "ready" && products.length > 0 && <div className="product-results__grid">{products.map(product => <ProductCard key={product.product_id} product={product} />)}</div>}
        {state === "ready" && products.length < total && <div className="product-results__load-more"><button type="button" onClick={loadMore}>Load more products</button></div>}
        {state === "ready" && products.length === 0 && <div className="product-results__state"><h2>{category ? "No products available in this category yet." : "No products found"}</h2><p>{category ? "Try another category or browse the full marketplace." : "Try a different product name or category."}</p><Link to="/products">Browse all products</Link></div>}
    </main></>;
};
export default ProductSearchResults;
