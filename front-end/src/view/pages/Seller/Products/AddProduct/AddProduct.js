import "./AddProduct.scss";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import SellerLayout from "../../../../layouts/SellerLayout/SellerLayout";
import ProductPreviewModal from "../../../../components/ProductPreviewModal/ProductPreviewModal";

import {
    FaCloudUploadAlt,
    FaTrash
} from "react-icons/fa";

import {
    createProduct, getProductById, updateProduct
} from "../../../../../network/sellerApiService/sellerProductService";

const AddProduct = () => {

    const navigate = useNavigate();
    const { productId } = useParams();
    const isEditing = Boolean(productId);
    const [loadingProduct, setLoadingProduct] = useState(Boolean(productId));

    const inputRef = useRef(null);

    const [images, setImages] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [existingCategoryName, setExistingCategoryName] = useState("");

    const {

        register,

        handleSubmit,

        formState: {

            errors,

            isSubmitting

        },

        reset, watch

    } = useForm({

        defaultValues: {

            productName: "",

            shortDescription: "",

            description: "",

            categoryId: "",

            subCategory: "",

            brand: "",

            sku: "",

            sellingPrice: "",

            originalPrice: "",

            discountPercentage: "",

            gstPercentage: "",

            stockQuantity: "",

            minimumStockAlert: "",

            productStatus: true,

            featured: false

        }

    });

    const formValues = watch();
    const categoryLabels = { electronics: "Electronics", fashion: "Fashion", home: "Home & Kitchen", grocery: "Grocery" };
    const previewProduct = {
        product_id: productId || "preview-product",
        product_name: formValues.productName || "Your product name",
        short_description: formValues.shortDescription || "",
        description: formValues.description || "",
        category_name: categoryLabels[formValues.categoryId] || existingCategoryName || formValues.categoryId || "Category",
        brand: formValues.brand || "",
        sku: formValues.sku || "",
        selling_price: formValues.sellingPrice || 0,
        original_price: formValues.originalPrice || 0,
        discount_percentage: formValues.discountPercentage || 0,
        gst_percentage: formValues.gstPercentage || 0,
        stock_quantity: formValues.stockQuantity || 0,
        product_status: formValues.productStatus ? "active" : "inactive",
        average_rating: 0,
        total_reviews: 0,
        images: images.map((image, index) => ({ image_id: `preview-${index}`, image_url: image.preview, display_order: index + 1 }))
    };

    useEffect(() => {
        if (!productId) return;
        let active = true;
        getProductById(productId).then(({ response }) => {
            if (!active || !response?.product) return;
            const p = response.product;
            setExistingCategoryName(p.category_name || "");
            reset({ productName: p.product_name, shortDescription: p.short_description || "", description: p.description || "", categoryId: p.category_id || "", subCategory: p.sub_category || "", brand: p.brand || "", sku: p.sku || "", sellingPrice: p.selling_price, originalPrice: p.original_price || "", discountPercentage: p.discount_percentage || 0, gstPercentage: p.gst_percentage || 0, stockQuantity: p.stock_quantity ?? 0, minimumStockAlert: p.minimum_stock_alert ?? 5, productStatus: p.product_status === "active", featured: !!p.featured });
            setImages((response.images || []).map(image => ({ preview: image.image_url, existing: true })));
        }).catch(error => alert(error.response?.data?.status?.message || "Unable to load product."))
            .finally(() => active && setLoadingProduct(false));
        return () => { active = false; };
    }, [productId, reset]);

    const handleImageChange = (event) => {

        const files = Array.from(event.target.files);

        const imageList = files.map(file => ({

            file,

            preview: URL.createObjectURL(file)

        }));

        setImages(prev => [...prev, ...imageList]);

    };

    const removeImage = (index) => {

        URL.revokeObjectURL(images[index].preview);

        setImages(prev =>

            prev.filter((_, i) => i !== index)

        );

    };

    const onSubmit = async (data) => {

        if (images.length === 0 && !isEditing) {

            return alert("Please upload at least one product image.");

        }

        try {

            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {

                formData.append(key, value);

            });

            images.filter(image => image.file).forEach(image => {

                formData.append("images", image.file);

            });

            if (isEditing) await updateProduct(productId, formData);
            else await createProduct(formData);

            alert(isEditing ? "Product updated successfully." : "Product added successfully.");

            reset();

            images.forEach(image =>

                URL.revokeObjectURL(image.preview)

            );

            setImages([]);

            navigate("/seller/products");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to upload product."

            );

        }

    };

    return (

        <SellerLayout>

            <form

                className="add-product"

                onSubmit={handleSubmit(onSubmit)}

            >

                {loadingProduct && <div className="card" role="status">Loading product details…</div>}

                <div className="page-header">

                    <div>

                        <h2>

                            {isEditing ? "Edit Product" : "Add New Product"}

                        </h2>

                        <p>

                            {isEditing ? "Update your product details." : "Create a new product for your store."}

                        </p>

                    </div>

                    <button

                        type="submit"

                        className="publish-btn"

                        disabled={isSubmitting || loadingProduct}

                    >

                        {

                            isSubmitting

                                ? (isEditing ? "Saving..." : "Publishing...")

                                : (isEditing ? "Update Product" : "Publish Product")

                        }

                    </button>

                </div>

                <div className="add-product-grid">

                    <div className="left-column">

                        <div className="card">

                            <h3>

                                Product Images

                            </h3>

                            <div

                                className="upload-box"

                                onClick={() => inputRef.current.click()}

                            >

                                <FaCloudUploadAlt className="upload-icon" />

                                <h4>

                                    Upload Product Images

                                </h4>

                                <p>

                                    Click to browse images

                                </p>

                                <input

                                    hidden

                                    ref={inputRef}

                                    type="file"

                                    accept="image/*"

                                    multiple

                                    onChange={handleImageChange}

                                />

                            </div>

                            {

                                images.length > 0 && (

                                    <div className="image-preview">

                                        {

                                            images.map((image, index) => (

                                                <div

                                                    key={index}

                                                    className="image-card"

                                                >

                                                    <img

                                                        src={image.preview}

                                                        alt="Product"

                                                    />

                                                    <button

                                                        type="button"

                                                        onClick={() => removeImage(index)}

                                                    >

                                                        <FaTrash />

                                                    </button>

                                                </div>

                                            ))

                                        }

                                    </div>

                                )

                            }

                        </div>

                    </div>

                    <div className="right-column">

                        <div className="card">

                            <h3>

                                Product Information

                            </h3>

                            <div className="form-grid">
                                <div className="form-group full-width">

                                    <label>
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        {...register("productName", {
                                            required: "Product name is required"
                                        })}
                                    />

                                    <small>{errors.productName?.message}</small>

                                </div>

                                <div className="form-group full-width">

                                    <label>
                                        Short Description
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Write a short description"
                                        {...register("shortDescription")}
                                    />

                                </div>

                                <div className="form-group full-width">

                                    <label>
                                        Product Description
                                    </label>

                                    <textarea
                                        rows="7"
                                        placeholder="Describe your product..."
                                        {...register("description", {
                                            required: "Description is required"
                                        })}
                                    />

                                    <small>{errors.description?.message}</small>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        {...register("categoryId", {
                                            required: "Category is required"
                                        })}
                                    >

                                        <option value="">
                                            Select Category
                                        </option>

                                        {isEditing && existingCategoryName && formValues.categoryId && !categoryLabels[formValues.categoryId] && <option value={formValues.categoryId}>{existingCategoryName}</option>}

                                        <option value="electronics">Electronics</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="home">Home & Kitchen</option>
                                        <option value="grocery">Grocery</option>

                                    </select>

                                    <small>{errors.categoryId?.message}</small>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Sub Category
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter Sub Category"
                                        {...register("subCategory")}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Apple, Samsung..."
                                        {...register("brand")}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        SKU
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="SKU-1001"
                                        {...register("sku")}
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="card">

                            <h3>
                                Pricing
                            </h3>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Selling Price
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="0"
                                        {...register("sellingPrice", {
                                            required: "Selling price is required"
                                        })}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Original Price
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="0"
                                        {...register("originalPrice")}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Discount %
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="0"
                                        {...register("discountPercentage")}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        GST %
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="18"
                                        {...register("gstPercentage")}
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="card">

                            <h3>
                                Inventory
                            </h3>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Stock Quantity
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="100"
                                        {...register("stockQuantity")}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Minimum Stock Alert
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="10"
                                        {...register("minimumStockAlert")}
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="card">

                                <h3>
                                Product Status
                            </h3>

                            <div className="status-grid">

                                <label className="status-item">

                                    <input
                                        type="checkbox"
                                        {...register("productStatus")}
                                    />

                                    Active Product

                                </label>

                                <label className="status-item">

                                    <input
                                        type="checkbox"
                                        {...register("featured")}
                                    />

                                    Featured Product

                                </label>

                            </div>

                        </div>
                        <div className="action-buttons">

                            <button type="button" className="preview-btn" onClick={() => setPreviewOpen(true)}>
                                Preview
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/seller/products")}
                            >

                                Cancel

                            </button>

                            {!isEditing && <button
                                type="reset"
                                className="draft-btn"
                                onClick={() => {

                                    reset();

                                    setImages([]);

                                }}
                            >

                                Reset

                            </button>}

                            <button
                                type="submit"
                                className="publish-btn"
                                disabled={isSubmitting || loadingProduct}
                            >

                                {

                                    isSubmitting || loadingProduct

                                        ? (isEditing ? "Saving..." : "Publishing...")

                                        : (isEditing ? "Save Changes" : "Publish Product")

                                }

                            </button>

                        </div>

                    </div>

                </div>

            </form>

            {previewOpen && <ProductPreviewModal product={previewProduct} onClose={() => setPreviewOpen(false)} />}

        </SellerLayout>

    );

};

export default AddProduct;
