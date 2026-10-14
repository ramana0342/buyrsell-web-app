import { createSlice } from "@reduxjs/toolkit";

const sellerData = JSON.parse(
    localStorage.getItem("sellerProfileData")
);

const accessToken = localStorage.getItem("sellerAccessToken");

const initialState = {

    seller: sellerData || null,

    accessToken: accessToken || null,

    isAuthenticated: !!accessToken

};

const sellerSlice = createSlice({

    name: "seller",

    initialState,

    reducers: {

        registerSuccess: (state, action) => {

            state.seller = action.payload;

            localStorage.setItem(
                "sellerProfileData",
                JSON.stringify(action.payload)
            );

        },

        emailVerified: (state) => {

            if (state.seller) {

                state.seller.email_verified = true;

                localStorage.setItem(
                    "sellerProfileData",
                    JSON.stringify(state.seller)
                );

            }

        },

        loginSuccess: (state, action) => {

            state.seller = action.payload.seller;

            state.accessToken = action.payload.accessToken;

            state.isAuthenticated = true;

            localStorage.setItem(
                "sellerProfileData",
                JSON.stringify(action.payload.seller)
            );

            localStorage.setItem(
                "sellerAccessToken",
                action.payload.accessToken
            );

        },

        logoutSeller: (state) => {

            state.seller = null;

            state.accessToken = null;

            state.isAuthenticated = false;

            localStorage.removeItem(
                "sellerProfileData"
            );

            localStorage.removeItem(
                "sellerAccessToken"
            );

        }

    }

});

export const {

    registerSuccess,

    emailVerified,

    loginSuccess,

    logoutSeller

} = sellerSlice.actions;

export default sellerSlice.reducer;