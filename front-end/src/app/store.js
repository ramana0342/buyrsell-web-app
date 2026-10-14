import { configureStore } from "@reduxjs/toolkit";

import sellerReducer from "../features/seller/sellerSlice";
import customerReducer from "../features/customer/customerSlice";
import customerWishlistReducer from "../features/customer/customerWishlistSlice";
import customerCartReducer from "../features/customer/customerCartSlice";

export const store = configureStore({

    reducer: {

        seller: sellerReducer,

        customer: customerReducer,

        customerWishlist: customerWishlistReducer,

        customerCart: customerCartReducer


    }

});