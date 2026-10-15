import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "./Footer.scss";

const Footer = ({ seller = false }) => <footer className={`site-footer${seller ? " site-footer--seller" : ""}`}>
    <div className="site-footer__inner">
        <div className="site-footer__brand"><Link to="/" aria-label="buyRsell Mart home">buyRsell <span>Mart</span></Link><p>A trusted marketplace to discover great products and shop with confidence.</p></div>
        <nav className="site-footer__links" aria-label={seller ? "Seller navigation" : "Customer navigation"}>
            {(seller ? [["Dashboard", "/seller/dashboard"], ["Products", "/seller/products"], ["Add product", "/seller/products/add"]] : [["Home", "/"], ["Products", "/products"], ["Cart", "/customer/cart"], ["Wishlist", "/customer/wishlist"]]).map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
        <section className="site-footer__contact" aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading">Open to Opportunities</h2>
            <p>If there are any job opportunities, collaborations, or relevant professional opportunities, please feel free to contact me.</p>
            <div className="site-footer__contact-links">
                <a href="mailto:ramana.m0342@gmail.com"><FaEnvelope aria-hidden="true" /><span>ramana.m0342@gmail.com</span></a>
                <a href="tel:7993810342"><FaPhoneAlt aria-hidden="true" /><span>7993810342</span></a>
            </div>
        </section>
        <small>© {new Date().getFullYear()} buyRsell Mart. All rights reserved.</small>
    </div>
</footer>;

export default Footer;
