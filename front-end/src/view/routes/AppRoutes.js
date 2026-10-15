import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Seller/Register/Register";
import Login from "../pages/Seller/Login/Login";
import RegistrationSuccess from "../pages/Seller/RegistrationSuccess/RegistrationSuccess";
import VerifyEmail from "../pages/Seller/VerifyEmail/VerifyEmail";
import ForgotPassword from "../pages/Seller/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Seller/ResetPassword/ResetPassword";
import Dashboard from "../pages/Seller/Dashboard/Dashboard";
import AddProduct from "../pages/Seller/Products/AddProduct/AddProduct";
import ProductList from "../pages/Seller/Products/ProductList/ProductList";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Wishlist from "../pages/Customer/Wishlist/Wishlist";
import Cart from "../pages/Customer/Cart/Cart";
import PasswordResetSent from "../pages/Seller/PasswordResetSent/PasswordResetSent";
import ProductSearchResults from "../pages/ProductSearchResults/ProductSearchResults";
import Offers from "../pages/Customer/Offers/Offers";
import Footer from "../components/Footer/Footer";
import { useLocation } from "react-router-dom";

const AppFooter = () => {
    const location = useLocation();
    return location.pathname.startsWith("/seller/") ? null : <Footer />;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductSearchResults />} />
                <Route path="/seller/register" element={<Register />} />
                <Route path="/seller/login" element={<Login />} />
                <Route
                    path="/seller/registration-success"
                    element={<RegistrationSuccess />}
                />

                <Route
                    path="/seller/verify-email"
                    element={<VerifyEmail />}
                />
                <Route
                    path="/seller/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/seller/reset-password"
                    element={<ResetPassword />}
                />

                <Route
                    path="/seller/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/seller/products"
                    element={<ProductList />}
                />

                <Route
                    path="/seller/products/add"
                    element={<AddProduct />}
                />
                <Route path="/seller/products/edit/:productId" element={<AddProduct />} />
                <Route
                    path="/product/:slug"
                    element={<ProductDetails />}
                />

                <Route
                    path="/customer/wishlist"
                    element={<Wishlist />}
                />

                <Route
                    path="/customer/cart"
                    element={<Cart />}
                />
                <Route path="/customer/offers" element={<Offers />} />

                <Route
                    path="/seller/password-reset-sent"
                    element={<PasswordResetSent />}
                />
            </Routes>
            <AppFooter />


        </BrowserRouter>
    );
}

export default AppRoutes;
