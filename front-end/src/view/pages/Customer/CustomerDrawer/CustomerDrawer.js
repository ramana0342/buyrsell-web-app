import React from "react";
import "./CustomerDrawer.scss";

import { Link } from "react-router-dom";

import {
    FaTimes,
    FaUserCircle,
    FaShoppingCart,
    FaHeart,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

const CustomerDrawer = ({
    open,
    customer,
    onClose,
    onLogout
}) => {

    return (
        <>
            <div
                className={`customer-drawer-overlay ${open ? "active" : ""}`}
                onClick={onClose}
            />

            <aside
                className={`customer-drawer ${open ? "active" : ""}`}
            >
                <div className="customer-drawer__header">

                    <h3>
                        My Account
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>

                <div className="customer-drawer__profile">

                    <div className="customer-drawer__avatar">

                        <FaUserCircle />

                    </div>

                    <h4>

                        {customer?.full_name}

                    </h4>

                    <p>

                        {customer?.email}

                    </p>

                </div>

                <div className="customer-drawer__menu">

                    {/* <Link
                        to="/customer/profile"
                        onClick={onClose}
                    >
                        <FaUser />

                        <span>
                            My Profile
                        </span>
                    </Link> */}

                    <Link
                        to="/customer/cart"
                        onClick={onClose}
                    >
                        <FaShoppingCart />

                        <span>
                            Cart
                        </span>
                    </Link>

                    <Link
                        to="/customer/wishlist"
                        onClick={onClose}
                    >
                        <FaHeart />

                        <span>
                            Wishlist
                        </span>
                    </Link>

                    <Link to="/customer/offers" onClick={onClose}>
                        <FaUser />
                        <span>My Offers</span>
                    </Link>

                </div>

                <button
                    className="customer-drawer__logout"
                    onClick={onLogout}
                >
                    <FaSignOutAlt />

                    Logout
                </button>

            </aside>
        </>
    );

};

export default CustomerDrawer;
