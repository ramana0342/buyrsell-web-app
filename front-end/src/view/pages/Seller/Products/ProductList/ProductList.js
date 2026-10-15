import "./ProductList.scss";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaRedo } from "react-icons/fa";
import SellerLayout from "../../../../layouts/SellerLayout/SellerLayout";
import Pagination from "../../../../components/Pagination/Pagination";
import { getSellerProducts, deleteProduct } from "../../../../../network/sellerApiService/sellerProductService";
import { SkeletonRows } from "../../../../components/Skeletons/Skeletons";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, pageSize: 10 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getSellerProducts({ search: query, page, limit: 10 });
            setProducts(res.response || []);
            setPagination(res.pagination || { totalPages: 1, totalItems: (res.response || []).length, pageSize: 10 });
            setError("");
        } catch (err) {
            setError(err.response?.data?.status?.message || "Unable to load your products.");
        } finally { setLoading(false); }
    }, [page, query]);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    useEffect(() => {
        const value = search.trim();
        if (value.length > 0 && value.length < 3) return;
        if (value.length === 0) {
            setPage(1);
            setQuery("");
            return;
        }
        const timer = setTimeout(() => { setPage(1); setQuery(value); }, 350);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async product => {
        if (!window.confirm(`Delete “${product.product_name}”? This cannot be undone.`)) return;
        try {
            await deleteProduct(product.product_id);
            if (products.length === 1 && page > 1) setPage(current => current - 1);
            else loadProducts();
        } catch (err) {
            window.alert(err.response?.data?.status?.message || "Unable to delete product.");
        }
    };

    return <SellerLayout>
        <section className="product-list">
            <header className="product-list__header">
                <div><p className="product-list__eyebrow">CATALOG</p><h1>My Products</h1><p>Manage products uploaded to your store.</p></div>
                <Link to="/seller/products/add" className="add-product-btn"><FaPlus aria-hidden="true" /> Add Product</Link>
            </header>
            <div className="product-list__toolbar" role="search">
                <label className="search-box"><FaSearch aria-hidden="true" /><span className="sr-only">Search products</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, category, or SKU" /></label>
                {search.trim().length > 0 && search.trim().length < 3 && <small className="search-hint">Enter at least 3 characters to search</small>}
            </div>
            <div className="product-list__summary"><h2>Products</h2><span>{pagination.totalItems} {pagination.totalItems === 1 ? "product" : "products"}</span></div>
            {error ? <div className="product-list__state product-list__state--error" role="alert"><p>{error}</p><button onClick={loadProducts}><FaRedo /> Retry</button></div>
                : loading ? <SkeletonRows count={5} />
                    : products.length === 0 ? <div className="product-list__state"><div className="product-list__empty-icon">⌕</div><h3>{query ? "No Products Found" : "No Products Yet"}</h3><p>{query ? "No products match your search. Try another term." : "Start adding products to your marketplace."}</p>{!query && <Link to="/seller/products/add" className="add-product-btn"><FaPlus /> Add Product</Link>}</div>
                        : <>
                            <div className="product-table"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>{products.map(product => <tr key={product.product_id}>
                                    <td><div className="product-cell"><img src={product.product_image || "/placeholder-product.png"} alt="" /><div><strong>{product.product_name}</strong><small>Added {product.created_at ? new Date(product.created_at).toLocaleDateString() : "—"}</small></div></div></td>
                                    <td data-label="Category">{product.category_name || "Uncategorized"}</td><td data-label="Price">₹{Number(product.selling_price || 0).toLocaleString("en-IN")}</td><td data-label="Stock">{product.stock_quantity ?? 0}</td>
                                    <td data-label="Status"><span className={`status ${product.product_status === "active" ? "active" : "inactive"}`}>{product.product_status === "active" ? "Active" : "Inactive"}</span></td>
                                    <td data-label="Actions"><div className="product-actions"><Link aria-label={`View ${product.product_name}`} title="View product" to={`/product/${product.slug}`}><FaEye /></Link><Link aria-label={`Edit ${product.product_name}`} title="Edit product" to={`/seller/products/edit/${product.product_id}`}><FaEdit /></Link><button aria-label={`Delete ${product.product_name}`} title="Delete product" onClick={() => handleDelete(product)}><FaTrash /></button></div></td>
                                </tr>)}</tbody></table></div>
                            <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                        </>}
        </section>
    </SellerLayout>;
};
export default ProductList;
