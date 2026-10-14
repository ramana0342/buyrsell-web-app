import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { getAllProducts } from "../../../network/publicApiService/productService";

const ProductSearch = ({ mobile = false }) => {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [open, setOpen] = useState(false);
    const root = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const normalized = query.trim();

    useEffect(() => {
        const routeQuery = new URLSearchParams(location.search).get("search") || "";
        setQuery(routeQuery);
    }, [location.pathname, location.search]);

    useEffect(() => {
        const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    useEffect(() => {
        if (normalized.length < 3) { setItems([]); setStatus("idle"); return undefined; }
        const controller = new AbortController();
        setStatus("loading");
        const timer = setTimeout(async () => {
            try {
                const response = await getAllProducts({ search: normalized, limit: 6 }, { signal: controller.signal });
                setItems(response?.response || []);
                setStatus("ready");
            } catch (error) {
                if (error.name !== "CanceledError" && error.name !== "AbortError") setStatus("error");
            }
        }, 350);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [normalized]);

    const searchPage = () => {
        if (normalized.length >= 3) navigate(`/products?search=${encodeURIComponent(normalized)}`);
        setOpen(false);
    };

    return <div className={`product-search ${mobile ? "product-search--mobile" : ""}`} ref={root}>
        <form className="product-search__form" onSubmit={(event) => { event.preventDefault(); searchPage(); }}>
            <FaSearch aria-hidden="true" />
            <input aria-label="Search products" value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} placeholder={mobile ? "Search products..." : "Search products, brands & categories..."} />
            {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setOpen(false); if (location.pathname === "/products" && new URLSearchParams(location.search).has("search")) navigate("/"); }}>×</button>}
        </form>
        {open && normalized.length >= 3 && <div className="product-search__suggestions" role="listbox">
            {status === "loading" && <p className="product-search__message">Searching…</p>}
            {status === "error" && <p className="product-search__message">Could not load suggestions. Press Enter to retry.</p>}
            {status === "ready" && items.length === 0 && <p className="product-search__message">No products found.</p>}
            {items.slice(0, 5).map((item) => <button className="product-search__item" type="button" key={item.product_id} onClick={() => { setOpen(false); navigate(`/product/${item.slug}`); }}>
                <img src={item.images?.[0]?.image_url || "/favicon.svg"} alt="" /><span><b>{item.product_name}</b><small>{item.category_name || "Product"} · ₹{Number(item.selling_price || 0).toLocaleString("en-IN")}</small></span>
            </button>)}
            {status === "ready" && items.length > 0 && <button className="product-search__all" type="button" onClick={searchPage}>View all results for “{normalized}”</button>}
        </div>}
    </div>;
};
export default ProductSearch;
