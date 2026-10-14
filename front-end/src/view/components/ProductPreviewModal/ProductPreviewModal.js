import "./ProductPreviewModal.scss";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Gallery from "../../pages/ProductDetails/components/Gallery/Gallery";
import Breadcrumb from "../../pages/ProductDetails/components/Breadcrumb/Breadcrumb";
import ProductInfo from "../../pages/ProductDetails/components/ProductInfo/ProductInfo";
import ProductDescription from "../../pages/ProductDetails/components/ProductDescription/ProductDescription";

const ProductPreviewModal = ({ product, onClose }) => {
    useEffect(() => {
        const closeOnEscape = event => { if (event.key === "Escape") onClose(); };
        document.addEventListener("keydown", closeOnEscape);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = previousOverflow; };
    }, [onClose]);

    return <div className="product-preview-modal" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
        <section className="product-preview-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-preview-title">
            <header className="product-preview-modal__header"><div><p>MARKETPLACE VIEW</p><h2 id="product-preview-title">Product Preview</h2></div><button type="button" onClick={onClose} aria-label="Close product preview"><FaTimes /></button></header>
            <div className="product-preview-modal__body">
                <Breadcrumb product={product} />
                <section className="product-preview-modal__showcase">
                    <div className="product-preview-modal__gallery"><Gallery images={product.images} productName={product.product_name} discount={product.discount_percentage} /></div>
                    <div className="product-preview-modal__information"><ProductInfo product={product} displayOnly /></div>
                </section>
                <ProductDescription product={product} />
            </div>
        </section>
    </div>;
};
export default ProductPreviewModal;
