import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    addToWishlist,
    removeFromWishlist,
    getCustomerWishlist
} from "../../network/customerApiService/customerWishlistService";


export const fetchCustomerWishlist = createAsyncThunk(
    "customerWishlist/fetchCustomerWishlist",

    async (customerId, { rejectWithValue }) => {

        try {

            const response = await getCustomerWishlist();

            return response;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch wishlist."
            );

        }

    },
    {
        condition: (customerId, { getState }) => Boolean(customerId) &&
            getState().customerWishlist.customerId === String(customerId) &&
            !getState().customerWishlist.loading &&
            !getState().customerWishlist.actionLoading
    }
);



export const addProductToWishlist = createAsyncThunk(
    "customerWishlist/addProductToWishlist",

    async (productId, { rejectWithValue }) => {

        try {

            const response = await addToWishlist(productId);

            return response;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to add product to wishlist."
            );

        }

    }
);


export const removeProductFromWishlist = createAsyncThunk(
    "customerWishlist/removeProductFromWishlist",

    async (productId, { rejectWithValue }) => {

        try {

            const response = await removeFromWishlist(productId);

            return {
                productId,
                response
            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to remove product from wishlist."
            );

        }

    }
);


const initialState = {

    wishlist: [],

    loading: false,

    actionLoading: false,

    actionProductId: null,

    customerId: null,

    error: null

};


const customerWishlistSlice = createSlice({

    name: "customerWishlist",

    initialState,

    reducers: {

        clearWishlist: (state) => {

            state.wishlist = [];
            state.loading = false;
            state.actionLoading = false;
            state.actionProductId = null;
            state.error = null;
            state.customerId = null;

        },

        setWishlistCustomer: (state, action) => {
            const customerId = action.payload ? String(action.payload) : null;
            if (state.customerId !== customerId) {
                state.wishlist = [];
                state.loading = false;
                state.actionLoading = false;
                state.actionProductId = null;
                state.error = null;
                state.customerId = customerId;
            }

        }

    },


    extraReducers: (builder) => {

        builder


            // FETCH WISHLIST
            .addCase(
                fetchCustomerWishlist.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )


            .addCase(
                fetchCustomerWishlist.fulfilled,
                (state, action) => {

                    if (state.customerId !== String(action.meta.arg)) return;

                    state.loading = false;

                    state.wishlist =
                        action.payload.wishlist || [];

                }
            )


            .addCase(
                fetchCustomerWishlist.rejected,
                (state, action) => {

                    if (state.customerId !== String(action.meta.arg)) return;

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            )





            // ADD TO WISHLIST

            .addCase(
                addProductToWishlist.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionProductId =
                        action.meta.arg;

                    state.error = null;

                }
            )

            .addCase(
                addProductToWishlist.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    const wishlist =
                        action.payload.wishlist;

                    if (wishlist) {

                        state.wishlist.unshift(
                            wishlist
                        );

                    }

                }
            )

            .addCase(
                addProductToWishlist.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.error =
                        action.payload;

                }
            )


            // REMOVE FROM WISHLIST

            .addCase(
                removeProductFromWishlist.pending,
                (state, action) => {

                    state.actionLoading = true;

                    state.actionProductId =
                        action.meta.arg;

                    state.error = null;

                }
            )

            .addCase(
                removeProductFromWishlist.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionProductId = null;

                    state.wishlist =
                        state.wishlist.filter(
                            item =>
                                item.product_id !==
                                action.payload.productId
                        );

                }
            )

            .addCase(
                removeProductFromWishlist.rejected,
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
    clearWishlist,
    setWishlistCustomer
} = customerWishlistSlice.actions;


export default customerWishlistSlice.reducer;
