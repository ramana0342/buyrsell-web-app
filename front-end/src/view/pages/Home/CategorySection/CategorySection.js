import React from "react";
import { Link } from "react-router-dom";
import { FaDesktop, FaTshirt, FaCouch, FaShoppingBasket } from "react-icons/fa";
import "./CategorySection.scss";

const categories = [
    { id: "electronics", name: "Electronics", Icon: FaDesktop },
    { id: "fashion", name: "Fashion", Icon: FaTshirt },
    { id: "home", name: "Home & Kitchen", Icon: FaCouch },
    { id: "grocery", name: "Grocery", Icon: FaShoppingBasket }
];

const CategorySection = () => <section className="category-section">
    <div className="category-section__container">
        <div className="category-section__header"><div><span className="category-section__sub-title">Shop By Category</span><h2>Explore Categories</h2></div></div>
        <div className="category-section__grid">{categories.map(({ id, name, Icon }) => <Link key={id} to={`/products?category=${id}`} className="category-card">
            <div className="category-card__icon"><Icon aria-hidden="true" /></div><h3>{name}</h3><p>Browse products</p>
        </Link>)}</div>
    </div>
</section>;

export default CategorySection;
