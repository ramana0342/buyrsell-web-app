
import {
    getRequest,
    postRequest,
    patchRequest,
    deleteRequest
} from "../apiService/customerApiService";


// ==========================================
// GET CUSTOMER CART
// ==========================================

export const getCustomerCart = async () => {

    const response =
        await getRequest(
            "/customer/cart"
        );

    return response.data;

};



// ==========================================
// ADD PRODUCT TO CART
// ==========================================

export const addProductToCart = async (
    productId,
    quantity = 1
) => {

    const response =
        await postRequest(
            "/customer/cart",
            {
                data: {
                    productId,
                    quantity
                }
            }
        );

    return response.data;

};



// ==========================================
// UPDATE CART QUANTITY
// ==========================================

export const updateCartQuantity = async (
    productId,
    quantity
) => {

    const response =
        await patchRequest(
            `/customer/cart/${productId}`,
            {
                data: {
                    quantity
                }
            }
        );

    console.log(response)

    return response.data;


};



// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

export const removeProductFromCart = async (
    productId
) => {

    const response =
        await deleteRequest(
            `/customer/cart/${productId}`
        );

    return response.data;

};



// ==========================================
// CLEAR CUSTOMER CART
// ==========================================

export const clearCustomerCart = async () => {

    const response =
        await deleteRequest(
            "/customer/cart"
        );

    return response.data;

};