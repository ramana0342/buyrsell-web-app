import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import ProductCard from "./ProductCard/ProductCard";
import "./CategoryProducts.scss";

const CategoryProducts = ({ categories = [], loading, error, onRetry }) => {
    if (loading) return null;
    if (error) return <div className="home-category-products__error">Category products couldn’t be loaded. <button type="button" onClick={onRetry}>Retry</button></div>;

    return categories.filter(category => category.products?.length).map(category => (
        <section className="home-category-products" key={category.category_id}>
            <div className="home-category-products__container">
                <header className="home-category-products__header">
                    <div><p>Shop the collection</p><h2>{category.category_name}</h2></div>
                    {category.total > 4 && <Link to={`/products?category=${encodeURIComponent(category.category_id)}&excludeFeatured=true`} className="home-category-products__view-all">View All {category.category_name}<FaArrowRight aria-hidden="true" /></Link>}
                </header>
                <div className="home-category-products__grid">
                    {category.products.slice(0, 4).map(product => <ProductCard key={product.product_id} product={product} />)}
                </div>
            </div>
        </section>
    ));
};

export default CategoryProducts;
