import React from "react";
import "./Cart.scss";

import {
    FaShoppingCart,
    FaArrowRight,
    FaBoxOpen
} from "react-icons/fa";

import {
    Link
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    updateCartQuantityAsync,
    removeProductFromCartAsync
} from "../../../../features/customer/customerCartSlice";

import Header from "../../../components/Header/Header";
import CartItem from "./CartItem";
import OfferModal from "../Offers/OfferModal";
import { getEligibleCombinedOfferGroups, pruneOfferSelection } from "./cartOfferSelection";


const Cart = () => {
    const [offerProducts, setOfferProducts] = React.useState(null);
    const [selectedOfferProducts, setSelectedOfferProducts] = React.useState([]);

    const dispatch = useDispatch();


    // ==========================================
    // CART STATE
    // ==========================================

    const {
        cartItems,
        loading,
        actionLoading,
        actionProductId
    } = useSelector(
        state => state.customerCart
    );


    // ==========================================
    // QUANTITY UPDATE
    // ==========================================

    const handleQuantityChange = (
        productId,
        currentQuantity,
        stockQuantity,
        type
    ) => {

        let newQuantity = currentQuantity;


        if (type === "increase") {

            if (
                currentQuantity >=
                stockQuantity
            ) {
                return;
            }

            newQuantity =
                currentQuantity + 1;

        }


        if (type === "decrease") {

            if (
                currentQuantity <= 1
            ) {
                return;
            }

            newQuantity =
                currentQuantity - 1;

        }


        if (
            newQuantity ===
            currentQuantity
        ) {
            return;
        }


        dispatch(
            updateCartQuantityAsync({
                productId,
                quantity: newQuantity
            })
        );

    };


    // ==========================================
    // REMOVE PRODUCT
    // ==========================================

    const handleRemove = (
        productId
    ) => {

        if (
            actionLoading &&
            actionProductId === productId
        ) {
            return;
        }


        dispatch(
            removeProductFromCartAsync(
                productId
            )
        );

    };


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    const totalItems =
        cartItems.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );


    // ==========================================
    // SUBTOTAL
    // ==========================================

    const subtotal =
        cartItems.reduce(
            (total, item) =>
                total +
                Number(item.item_total),
            0
        );


    // ==========================================
    // DELIVERY
    // ==========================================

    const deliveryCharge =
        subtotal > 0
            ? 0
            : 0;


    // ==========================================
    // GRAND TOTAL
    // ==========================================

    const grandTotal =
        subtotal +
        deliveryCharge;

    const combinedOfferGroups = getEligibleCombinedOfferGroups(cartItems);
    const combinedOfferProductIds = new Set(combinedOfferGroups.flatMap(group => group.items.map(item => String(item.product_id))));
    const visibleSelectedOfferProducts = selectedOfferProducts.filter(id => combinedOfferProductIds.has(String(id)));
    const selectedSellerIds = new Set(combinedOfferGroups.filter(group => group.items.some(item => visibleSelectedOfferProducts.includes(String(item.product_id)))).map(group => group.sellerId));
    const selectedAcrossSellers = selectedSellerIds.size > 1;
    React.useEffect(() => {
        const pruned = pruneOfferSelection(selectedOfferProducts, cartItems);
        if (JSON.stringify(pruned) !== JSON.stringify(selectedOfferProducts)) setSelectedOfferProducts(pruned);
    }, [cartItems, selectedOfferProducts]);
    const toggleOfferSelection = (productId, checked) => setSelectedOfferProducts(current => checked
        ? [...new Set([...current, String(productId)])]
        : current.filter(id => id !== String(productId)));
    const selectSellerItems = (sellerId, checked) => {
        const sellerProductIds = combinedOfferGroups.find(group => group.sellerId === String(sellerId))?.items.map(item => String(item.product_id)) || [];
        setSelectedOfferProducts(current => checked
            ? [...new Set([...current, ...sellerProductIds])]
            : current.filter(id => !sellerProductIds.includes(id)));
    };
    const openSingleOffer = item => {
        if (!localStorage.getItem("customerAccessToken")) { window.dispatchEvent(new Event("openCustomerAuthModal")); return; }
        setOfferProducts([{ ...item, images: [{ image_url: item.image }] }]);
    };
    const openCombinedOffer = items => {
        if (!localStorage.getItem("customerAccessToken")) { window.dispatchEvent(new Event("openCustomerAuthModal")); return; }
        setOfferProducts(items.map(item => ({ ...item, images: [{ image_url: item.image }] })));
    };


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (
        value
    ) => {

        return Number(
            value
        ).toLocaleString(
            "en-IN"
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>

                <Header />

                <main className="cart-page">

                    <div className="cart-page__loading">

                        <span className="cart-spinner"></span>

                        <p>
                            Loading your cart...
                        </p>

                    </div>

                </main>

            </>
        );

    }


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (!cartItems.length) {

        return (
            <>

                <Header />

                <main className="cart-page">

                    <div className="cart-empty">

                        <div className="cart-empty__icon">

                            <FaShoppingCart />

                        </div>


                        <h1>
                            Your Cart is Empty
                        </h1>


                        <p>

                            Looks like you haven't
                            added anything to your
                            cart yet.

                        </p>


                        <Link
                            to="/"
                            className="cart-empty__button"
                        >

                            Continue Shopping

                            <FaArrowRight />

                        </Link>

                    </div>

                </main>

            </>
        );

    }


    // ==========================================
    // CART PAGE
    // ==========================================

    return (

        <>

            <Header />


            <main className="cart-page">


                {/* ==================================
                    PAGE HEADER
                ================================== */}

                <section className="cart-header">

                    <div>

                        <span className="cart-header__eyebrow">

                            <FaShoppingCart />

                            Shopping Cart

                        </span>


                        <h1>
                            Your Cart
                        </h1>


                        <p>

                            {totalItems}{" "}

                            {totalItems === 1
                                ? "item"
                                : "items"
                            }

                            {" "}
                            in your cart

                        </p>

                    </div>

                </section>



                {/* ==================================
                    CART CONTENT
                ================================== */}

                <section className="cart-content">


                    {/* ==================================
                        CART ITEMS
                    ================================== */}

                    <div className="cart-items">


                        {/* DESKTOP HEADER */}

                        <div className="cart-items__header">

                            <span>
                                Product
                            </span>

                            <span>
                                Price
                            </span>

                            <span>
                                Quantity
                            </span>

                            <span>
                                Total
                            </span>

                            <span></span>

                        </div>

                        {combinedOfferGroups.length > 0 && <div className="cart-combined-selection">
                            <strong>Combine products in one offer</strong>
                            {combinedOfferGroups.map(({ sellerId, sellerName, items: sellerItems }) => {
                                const selected = sellerItems.filter(item => visibleSelectedOfferProducts.includes(String(item.product_id)));
                                const allSelected = selected.length === sellerItems.length;
                                const listedTotal = selected.reduce((sum, item) => sum + Number(item.selling_price) * Number(item.quantity), 0);
                                return <div className="cart-combined-selection__seller" key={sellerId}>
                                    <label><input type="checkbox" checked={allSelected} onChange={event => selectSellerItems(sellerId, event.target.checked)} /> Select all eligible items from {sellerName}</label>
                                    {selected.length > 0 && <div className="cart-combined-selection__summary">
                                        <span>{selected.map(item => `${item.product_name} × ${item.quantity} (${`₹${formatPrice(Number(item.selling_price) * Number(item.quantity))}`})`).join(" · ")}</span>
                                        <strong>Selected listed total: ₹{formatPrice(listedTotal)}</strong>
                                        <button type="button" className="cart-offer-button" onClick={() => openCombinedOffer(selected)}>{selected.length > 1 ? `Make Combined Offer (${selected.length})` : "Make Offer for Selected Item"}</button>
                                    </div>}
                                </div>;
                            })}
                            {selectedAcrossSellers && <p role="status">Your selection includes multiple sellers. Create a separate offer for each seller using the groups above.</p>}
                        </div>}



                        {/* CART ITEMS */}

                        {
                            cartItems.map(
                                item => {

                                    const isItemLoading =
                                        actionLoading &&
                                        actionProductId ===
                                        item.product_id;


                                    return (

                                        <CartItem
                                            key={
                                                item.cart_id
                                            }
                                            item={
                                                item
                                            }
                                            isLoading={
                                                isItemLoading
                                            }
                                            onQuantityChange={
                                                handleQuantityChange
                                            }
                                            onRemove={
                                                handleRemove
                                            }
                                            formatPrice={
                                                formatPrice
                                            }
                                            onMakeOffer={openSingleOffer}
                                            showCombinedOfferSelection={combinedOfferProductIds.has(String(item.product_id))}
                                            selectedForOffer={visibleSelectedOfferProducts.includes(String(item.product_id))}
                                            onSelectForOffer={toggleOfferSelection}
                                        />

                                    );

                                }
                            )
                        }


                    </div>



                    {/* ==================================
                        ORDER SUMMARY
                    ================================== */}

                    <aside className="cart-summary">


                        <div className="cart-summary__top">

                            <span className="cart-summary__eyebrow">

                                <FaBoxOpen />

                                Order Summary

                            </span>


                            <h2>
                                Summary
                            </h2>

                        </div>



                        <div className="cart-summary__rows">


                            <div>

                                <span>
                                    Items ({totalItems})
                                </span>

                                <strong>

                                    ₹
                                    {formatPrice(
                                        subtotal
                                    )}

                                </strong>

                            </div>


                            <div>

                                <span>
                                    Subtotal
                                </span>

                                <strong>

                                    ₹
                                    {formatPrice(
                                        subtotal
                                    )}

                                </strong>

                            </div>


                            <div>

                                <span>
                                    Delivery
                                </span>

                                <strong className="free">
                                    FREE
                                </strong>

                            </div>


                        </div>



                        <div className="cart-summary__total">

                            <span>
                                Total
                            </span>

                            <strong>

                                ₹
                                {formatPrice(
                                    grandTotal
                                )}

                            </strong>

                        </div>



                        <Link
                            to="/"
                            className="cart-summary__continue"
                        >

                            Continue Shopping

                        </Link>


                    </aside>


                </section>


            </main>

            {offerProducts && <OfferModal products={offerProducts} onClose={() => setOfferProducts(null)} />}
        </>

    );

};


export default Cart;
