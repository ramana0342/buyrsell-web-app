import {
    getRequest,
    postRequest,
    deleteRequest
} from "../apiService/customerApiService";


export const addToWishlist = async (productId) => {

    const res = await postRequest(
        `/customer/wishlist/${productId}`
    );

    return res.data;
};


export const removeFromWishlist = async (productId) => {

    const res = await deleteRequest(
        `/customer/wishlist/${productId}`
    );

    return res.data;
};


export const getCustomerWishlist = async () => {

    const res = await getRequest(
        "/customer/wishlist"
    );

    return res.data;
};


export const checkWishlist = async (productId) => {

    const res = await getRequest(
        `/customer/wishlist/${productId}`
    );

    return res.data;
};