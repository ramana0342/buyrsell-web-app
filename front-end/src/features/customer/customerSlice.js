import { createSlice } from "@reduxjs/toolkit";

const customerData = JSON.parse(
    localStorage.getItem("customerProfileData")
);

const accessToken = localStorage.getItem(
    "customerAccessToken"
);

const initialState = {

    customer: customerData || null,

    accessToken: accessToken || null,

    isAuthenticated: !!accessToken

};

const customerSlice = createSlice({

    name: "customer",

    initialState,

    reducers: {

        registerSuccess: (state, action) => {

            state.customer = action.payload.customer;

            state.accessToken = action.payload.accessToken;

            state.isAuthenticated = true;

            localStorage.setItem(

                "customerProfileData",

                JSON.stringify(action.payload.customer)

            );

            localStorage.setItem(

                "customerAccessToken",

                action.payload.accessToken

            );

        },

        loginSuccess: (state, action) => {

            state.customer = action.payload.customer;

            state.accessToken = action.payload.accessToken;

            state.isAuthenticated = true;

            localStorage.setItem(

                "customerProfileData",

                JSON.stringify(action.payload.customer)

            );

            localStorage.setItem(

                "customerAccessToken",

                action.payload.accessToken

            );

        },

        emailVerified: (state) => {

            if (state.customer) {

                state.customer.email_verified = true;

                localStorage.setItem(

                    "customerProfileData",

                    JSON.stringify(state.customer)

                );

            }

        },

        updateAccessToken: (state, action) => {

            state.accessToken = action.payload;

            state.isAuthenticated = true;

            localStorage.setItem(

                "customerAccessToken",

                action.payload

            );

        },

        logoutCustomer: (state) => {

            state.customer = null;

            state.accessToken = null;

            state.isAuthenticated = false;

            localStorage.removeItem(

                "customerProfileData"

            );

            localStorage.removeItem(

                "customerAccessToken"

            );

            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("customerSessionEnded"));
            }

        }

    }

});

export const {

    registerSuccess,

    loginSuccess,

    emailVerified,

    updateAccessToken,

    logoutCustomer

} = customerSlice.actions;

export default customerSlice.reducer;
