import "./SellerSidebar.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutSeller } from "../../../features/seller/sellerSlice";

const SellerSidebar = ({ onNavigate = () => {} }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logoutSeller());
        onNavigate();
        navigate("/seller/login");
    };
    return <aside className="seller-sidebar" aria-label="Seller navigation">
        <Link to="/seller/dashboard" onClick={onNavigate} className="seller-sidebar__logo" aria-label="buyRsell Mart seller dashboard"><span className="seller-sidebar__mark"><img src="/preview.png" alt="" /></span><span>buyRsell <b>Mart</b></span></Link>
        <p className="seller-sidebar__caption">WORKSPACE</p>
        <nav className="seller-sidebar__nav">
            <NavLink to="/seller/dashboard" onClick={onNavigate} className={({ isActive }) => `seller-sidebar__link${isActive ? " is-active" : ""}`}><FaTachometerAlt /><span>Dashboard</span></NavLink>
            <NavLink to="/seller/products" onClick={onNavigate} className={({ isActive }) => `seller-sidebar__link${isActive ? " is-active" : ""}`}><FaBoxOpen /><span>Products</span></NavLink>
        </nav>
        <div className="seller-sidebar__bottom"><button className="seller-sidebar__logout" onClick={handleLogout}><FaSignOutAlt /><span>Logout</span></button></div>
    </aside>;
};
export default SellerSidebar;
