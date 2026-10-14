import "./SellerTopbar.scss";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const getPageTitle = pathname => {
    if (pathname.startsWith("/seller/products/edit/")) return "Edit Product";
    if (pathname === "/seller/products/add") return "Add Product";
    if (pathname.startsWith("/seller/products")) return "Products";
    if (pathname.startsWith("/seller/dashboard")) return "Dashboard";
    const lastSegment = pathname.split("/").filter(Boolean).pop();
    return lastSegment ? lastSegment.replace(/[-_]/g, " ").replace(/\b\w/g, char => char.toUpperCase()) : "Seller Workspace";
};

const SellerTopbar = ({ onMenuClick, menuOpen }) => {
    const { pathname } = useLocation();
    const seller = useSelector(state => state.seller?.seller);
    const displayName = seller?.store_name || seller?.business_name || seller?.seller_name || seller?.name || "Seller account";
    return <header className="seller-topbar">
        <button className="seller-topbar__menu" onClick={onMenuClick} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <FaTimes /> : <FaBars />}</button>
        <div className="seller-topbar__heading"><p>SELLER WORKSPACE</p><h1>{getPageTitle(pathname)}</h1></div>
        <div className="seller-topbar__profile"><FaUserCircle aria-hidden="true" /><span>{displayName}</span></div>
    </header>;
};
export default SellerTopbar;
