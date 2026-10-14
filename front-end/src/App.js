import AppRoutes from "./view/routes/AppRoutes";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchCustomerWishlist,
    setWishlistCustomer
} from "./features/customer/customerWishlistSlice";
import {
    fetchCustomerCart,
    setCartCustomer
} from "./features/customer/customerCartSlice";


function App() {

    const dispatch = useDispatch();
    const { customer, accessToken } = useSelector(state => state.customer);
    const activeCustomerId = useRef(null);

    useLayoutEffect(() => {
        const customerId = customer?.customer_id ? String(customer.customer_id) : null;

        if (activeCustomerId.current !== customerId) {
            activeCustomerId.current = customerId;
            dispatch(setCartCustomer(customerId));
            dispatch(setWishlistCustomer(customerId));
            if (customerId && accessToken) {
                dispatch(fetchCustomerWishlist(customerId));
                dispatch(fetchCustomerCart(customerId));
            }
        }
    }, [accessToken, customer, dispatch]);

    useEffect(() => {
        const refreshCustomerData = () => {
            const customerId = customer?.customer_id ? String(customer.customer_id) : null;
            if (!customerId || !localStorage.getItem("customerAccessToken")) return;
            dispatch(fetchCustomerWishlist(customerId));
            dispatch(fetchCustomerCart(customerId));
        };

        window.addEventListener("customerTokenRefreshed", refreshCustomerData);
        return () => window.removeEventListener("customerTokenRefreshed", refreshCustomerData);
    }, [customer, dispatch]);

    return <AppRoutes />;
}

export default App;
