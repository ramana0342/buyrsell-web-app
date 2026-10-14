import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getCustomerCart,
    addProductToCart,
    updateCartQuantity,
    removeProductFromCart,
    clearCustomerCart
} from "../../network/customerApiService/customerCartService";


// ==========================================
// GET CUSTOMER CART
// ==========================================

export const fetchCustomerCart = createAsyncThunk(
    "customerCart/fetchCustomerCart",

    async (customerId, { rejectWithValue }) => {

        try {

            const response = await getCustomerCart();

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch cart"
            );
        }
    },
    {
        condition: (customerId, { getState }) => Boolean(customerId) &&
            getState().customerCart.customerId === String(customerId) &&
            !getState().customerCart.loading &&
            !getState().customerCart.actionLoading
    }
);


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

export const addProductToCartAsync = createAsyncThunk(
    "customerCart/addProductToCart",

    async (
        { productId, quantity = 1 },
        { rejectWithValue }
    ) => {

        try {

            const response = await addProductToCart(
                productId,
                quantity
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    }
);


// ==========================================
// UPDATE CART QUANTITY
// ==========================================

export const updateCartQuantityAsync = createAsyncThunk(
    "customerCart/updateCartQuantity",

    async (
        { productId, quantity },
        { rejectWithValue }
    ) => {

        try {

            const response = await updateCartQuantity(
                productId,
                quantity
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update cart quantity"
            );
        }
    }
);


// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

export const removeProductFromCartAsync = createAsyncThunk(
    "customerCart/removeProductFromCart",

    async (
        productId,
        { rejectWithValue }
    ) => {

        try {

            const response = await removeProductFromCart(
                productId
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to remove product from cart"
            );
        }
    }
);


// ==========================================
// CLEAR CUSTOMER CART
// ==========================================

export const clearCustomerCartAsync = createAsyncThunk(
    "customerCart/clearCustomerCart",

    async (_, { rejectWithValue }) => {

        try {

            const response = await clearCustomerCart();

            return response;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to clear cart"
            );
        }
    }
);


// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {

    cartItems: [],

    loading: false,

    actionLoading: false,

    actionProductId: null,

    customerId: null,

    error: null

};


// ==========================================
// SLICE
// ==========================================

const customerCartSlice = createSlice({

    name: "customerCart",

    initialState,


    reducers: {

        clearCartError: (state) => {

            state.error = null;

        },

        setCartCustomer: (state, action) => {
            const customerId = action.payload ? String(action.payload) : null;
            if (state.customerId !== customerId) {
                state.cartItems = [];
                state.loading = false;
                state.actionLoading = false;
                state.actionProductId = null;
                state.error = null;
                state.customerId = customerId;
            }

        },


        clearCart: (state) => {

            state.cartItems = [];

            state.loading = false;

            state.actionLoading = false;

            state.actionProductId = null;

            state.error = null;

            state.customerId = null;

        }

    },


    extraReducers: (builder) => {

        builder


            // ==========================================
            // FETCH CART
            // ==========================================

            .addCase(
                fetchCustomerCart.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;

                }
            )


            .addCase(
                fetchCustomerCart.fulfilled,
                (state, action) => {

                    if (state.customerId !== String(action.meta.arg)) return;

                    state.loading = false;

                    state.cartItems =
                        action.payload || [];

                    state.error = null;

                }
            )


            .addCase(
                fetchCustomerCart.rejected,
                (state, action) => {

                    if (state.customerId !== String(action.meta.arg)) return;

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            )


            // ==========================================
            // ADD PRODUCT
            // ==========================================

            .addCase(
                addProductToCartAsync.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionProductId =
                        action.meta.arg.productId;

                    state.error = null;

                }
            )


            .addCase(
                addProductToCartAsync.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;


                    const updatedItem =
                        action.payload;


                    const existingIndex =
                        state.cartItems.findIndex(
                            (item) =>
                                item.product_id ===
                                updatedItem.product_id
                        );


                    if (existingIndex !== -1) {

                        state.cartItems[existingIndex] =
                            updatedItem;

                    } else {

                        state.cartItems.unshift(
                            updatedItem
                        );

                    }


                    state.error = null;

                }
            )


            .addCase(
                addProductToCartAsync.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.error =
                        action.payload;

                }
            )


            // ==========================================
            // UPDATE QUANTITY
            // ==========================================

            .addCase(
                updateCartQuantityAsync.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionProductId =
                        action.meta.arg.productId;

                    state.error = null;

                }
            )


            .addCase(
                updateCartQuantityAsync.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    const updatedItem =
                        action.payload;


                    const index =
                        state.cartItems.findIndex(
                            (item) =>
                                item.product_id ===
                                updatedItem.product_id
                        );


                    if (index !== -1) {

                        state.cartItems[index] = {

                            ...state.cartItems[index],

                            ...updatedItem

                        };

                    }


                    state.error = null;

                }
            )


            .addCase(
                updateCartQuantityAsync.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.error =
                        action.payload;

                }
            )


            // ==========================================
            // REMOVE PRODUCT
            // ==========================================

            .addCase(
                removeProductFromCartAsync.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionProductId =
                        action.meta.arg;

                    state.error = null;

                }
            )


            .addCase(
                removeProductFromCartAsync.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    const removedItem =
                        action.payload;


                    state.cartItems =
                        state.cartItems.filter(
                            (item) =>
                                item.product_id !==
                                removedItem.product_id
                        );


                    state.error = null;

                }
            )


            .addCase(
                removeProductFromCartAsync.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.error =
                        action.payload;

                }
            )


            // ==========================================
            // CLEAR CART
            // ==========================================

            .addCase(
                clearCustomerCartAsync.pending,
                (state) => {

                    state.actionLoading = true;

                    state.actionProductId = null;

                    state.error = null;

                }
            )


            .addCase(
                clearCustomerCartAsync.fulfilled,
                (state) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.cartItems = [];

                    state.error = null;

                }
            )


            .addCase(
                clearCustomerCartAsync.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.error =
                        action.payload;

                }
            );

    }

});


export const {
    clearCartError,
    clearCart,
    setCartCustomer
} = customerCartSlice.actions;


export default customerCartSlice.reducer;
