import React, { useEffect, useState } from "react";
import "./Header.scss";

import { Link, useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaBars,
  FaTimes,
  FaStore,
  FaUser,
  FaChevronRight,
  FaSignOutAlt
} from "react-icons/fa";

import CustomerDrawer from "../../pages/Customer/CustomerDrawer/CustomerDrawer";
import ProductSearch from "./ProductSearch";


import { useDispatch, useSelector } from "react-redux";

import CustomerAuthModal from "../../pages/Customer/CustomerAuth/CustomerAuthModal/CustomerAuthModal";

import { logoutCustomer, updateAccessToken } from "../../../features/customer/customerSlice";
import { customerLogout } from "../../../network/customerApiService/customerAuthService";
import { clearCart } from "../../../features/customer/customerCartSlice";
import { clearWishlist } from "../../../features/customer/customerWishlistSlice";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  const [

    customerModalOpen,

    setCustomerModalOpen

  ] = useState(false);

  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);

  const [

    customerModalScreen,

    setCustomerModalScreen

  ] = useState("login");

  const dispatch = useDispatch();

  const { seller, isAuthenticated } = useSelector(
    (state) => state.seller
  );

  const {

    customer,

    isAuthenticated: customerAuthenticated

  } = useSelector(

    (state) => state.customer

  );



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const openLogin = () => openCustomerModal("login");
    const expireSession = () => {
      dispatch(logoutCustomer());
      dispatch(clearCart());
      dispatch(clearWishlist());
    };
    const refreshToken = event => dispatch(updateAccessToken(event.detail));
    window.addEventListener("openCustomerAuthModal", openLogin);
    window.addEventListener("customerSessionExpired", expireSession);
    window.addEventListener("customerTokenRefreshed", refreshToken);
    return () => {
      window.removeEventListener("openCustomerAuthModal", openLogin);
      window.removeEventListener("customerSessionExpired", expireSession);
      window.removeEventListener("customerTokenRefreshed", refreshToken);
    };
  }, [dispatch]);



  useEffect(() => {

    if (mobileMenuOpen || customerDrawerOpen) {

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

    } else {

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

    }

    return () => {

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

    };

  }, [mobileMenuOpen, customerDrawerOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openCustomerModal = (screen = "login") => {

    setCustomerModalScreen(screen);

    setCustomerModalOpen(true);

  };

  const closeCustomerModal = () => {

    setCustomerModalOpen(false);

  };

  const handleCustomerLogout = async () => {
    dispatch(logoutCustomer());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/", { replace: true });
    try { await customerLogout(); } catch (error) { console.error("Customer logout request failed", error); }
    setCustomerDrawerOpen(false);
  };

  const openCustomerDrawer = () => {

    setCustomerDrawerOpen(true);

  };

  const closeCustomerDrawer = () => {

    setCustomerDrawerOpen(false);

  };

  const getSellerRoute = () => {
    if (!seller) {
      return "/seller/register";
    }

    if (!seller.email_verified) {
      return "/seller/registration-success";
    }

    return "/seller/login";
  };

  return (
    <>
      {/* ===========================================
                    HEADER
      ============================================ */}

      <header
        className={`header ${isScrolled ? "header--scrolled" : ""
          }`}
      >
        <div className="header__container">

          {/* ===========================================
                        LOGO
          ============================================ */}

          <Link
            to="/"
            className="header__logo"
            onClick={closeMobileMenu}
          >
            <div className="header__logo-icon">
              <img src="/preview.png" alt="" />
            </div>

            <div className="header__logo-content">

              <h2>
                buyRsell <span>Mart</span>
              </h2>

              <p>
                Discover • Buy • Sell
              </p>

            </div>
          </Link>

          {/* ===========================================
                    DESKTOP SEARCH
          ============================================ */}

          <ProductSearch />




          <nav className="header__nav">

            {!seller && (
              <Link
                to="/seller/register"
                className="header__seller-btn"
              >
                <FaStore />

                <span>
                  Become Seller
                </span>
              </Link>
            )}

            {seller && !isAuthenticated && (
              <Link
                to={getSellerRoute()}
                className="header__seller-btn"
              >
                <FaStore />

                <span>
                  Continue Seller
                </span>
              </Link>
            )}

            {seller && isAuthenticated && (
              <Link
                to="/seller/dashboard"
                className="header__seller-btn"
              >
                <FaStore />

                <span>
                  Seller Dashboard
                </span>
              </Link>
            )}

            {/* ==============================
                    LOGIN
            =============================== */}

            {
              !customerAuthenticated ? (

                <>
                  <button
                    type="button"
                    className="header__login"
                    onClick={() => openCustomerModal("login")}
                  >
                    <FaUser />
                    <span>Login</span>
                  </button>

                  <button
                    type="button"
                    className="header__signup"
                    onClick={() => openCustomerModal("register")}
                  >
                    <span>Sign Up</span>
                    <FaChevronRight className="signup-arrow" />
                  </button>
                </>

              ) : (

                <button
                  type="button"
                  className="header__customer"
                  onClick={openCustomerDrawer}
                >

                  <div className="header__customer-avatar">

                    {
                      customer?.full_name
                        ?.split(" ")
                        .map(name => name[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    }

                  </div>

                  <div className="header__customer-info">

                    <span className="header__customer-name">
                      {customer?.full_name}
                    </span>

                  </div>

                  <div className="header__customer-indicator" />

                </button>

              )
            }

          </nav>

          {/* ===========================================
                    MOBILE TOGGLE
          ============================================ */}

          <button
            type="button"
            className="header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>

      </header>

      {/* ===========================================
                MOBILE SEARCH
      ============================================ */}

      <div className="header__mobile-search">

        <ProductSearch mobile />

      </div>

      {/* ===========================================
                  MOBILE OVERLAY
                  Continue in Part 3
      ============================================ */}

      <div
        className={`header__mobile-overlay ${mobileMenuOpen ? "active" : ""
          }`}
        onClick={closeMobileMenu}
      />

      {/* ===========================================
                  MOBILE SIDEBAR
      ============================================ */}

      <aside
        className={`header__mobile-sidebar ${mobileMenuOpen ? "active" : ""
          }`}
      >

        {/* ===========================================
                    SIDEBAR HEADER
        ============================================ */}

        <div className="header__mobile-sidebar-header">

          <div className="header__mobile-brand">

            <div className="header__mobile-brand-icon">
              <FaStore />
            </div>

            <div className="header__mobile-brand-content">

              <h3>buyRsell Mart</h3>

              <p>
                Discover • Buy • Sell
              </p>

            </div>

          </div>

          <button
            type="button"
            className="header__mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close Navigation"
          >
            <FaTimes />
          </button>

        </div>

        {/* ===========================================
                    SIDEBAR NAVIGATION
        ============================================ */}

        <nav className="header__mobile-nav">

          {!seller && (

            <Link
              to="/seller/register"
              className="header__mobile-nav-item"
              onClick={closeMobileMenu}
            >

              <FaStore />

              <span>
                Become Seller
              </span>

            </Link>

          )}

          {seller && !isAuthenticated && (

            <Link
              to={getSellerRoute()}
              className="header__mobile-nav-item"
              onClick={closeMobileMenu}
            >

              <FaStore />

              <span>
                Continue Seller
              </span>

            </Link>

          )}

          {seller && isAuthenticated && (

            <Link
              to="/seller/dashboard"
              className="header__mobile-nav-item"
              onClick={closeMobileMenu}
            >

              <FaStore />

              <span>
                Seller Dashboard
              </span>

            </Link>

          )}

          {!customerAuthenticated ? (
            <>
              <button
                type="button"
                className="header__mobile-nav-item"
                onClick={() => {
                  closeMobileMenu();
                  openCustomerModal("login");
                }}
              >
                <FaUser />
                <span>Customer Login</span>
              </button>

              <button
                type="button"
                className="header__mobile-nav-item header__mobile-nav-item--primary"
                onClick={() => {
                  closeMobileMenu();
                  openCustomerModal("register");
                }}
              >
                <FaChevronRight />
                <span>Create Account</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="header__mobile-nav-item"
                onClick={() => {
                  closeMobileMenu();
                  openCustomerDrawer();
                }}
              >
                <FaUser />
                <span>My Account</span>
              </button>

              <button
                type="button"
                className="header__mobile-nav-item"
                onClick={() => {
                  closeMobileMenu();
                  handleCustomerLogout();
                }}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          )}

        </nav>

        {/* ===========================================
                    SIDEBAR FOOTER
        ============================================ */}

        <div className="header__mobile-footer">

          <p>
            Welcome to India's trusted marketplace.
          </p>

          <small>
            Buy securely • Sell confidently
          </small>

        </div>

      </aside>


      <CustomerAuthModal

        isOpen={customerModalOpen}

        onClose={closeCustomerModal}

        initialScreen={customerModalScreen}

      />


      <CustomerDrawer
        open={customerDrawerOpen}
        customer={customer}
        onClose={closeCustomerDrawer}
        onLogout={handleCustomerLogout}
      />


    </>
  );
};

export default Header;
