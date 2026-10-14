import {

    postRequest,

    getRequest,

    patchRequest,

    deleteRequest

} from "../apiService/sellerApiService";



// Create Product

export const createProduct = async (formData) => {

    const res = await postRequest(

        "/seller/products",

        {

            data: formData,

            config: {

                headers: {

                    "Content-Type": "multipart/form-data"

                }

            }

        }

    );

    return res.data;

};



// Get Seller Products

export const getSellerProducts = async (params = {}) => {

    const res = await getRequest(

        "/seller/products",
        { params }

    );

    return res.data;

};

export const getSellerDashboardStats = async () => {
    const res = await getRequest("/seller/dashboard/stats");
    return res.data;
};



// Get Single Product

export const getProductById = async (productId) => {

    const res = await getRequest(

        `/seller/products/${productId}`

    );

    return res.data;

};



// Update Product

export const updateProduct = async (

    productId,

    formData

) => {

    const res = await patchRequest(

        `/seller/products/${productId}`,

        {

            data: formData,

            config: {

                headers: {

                    "Content-Type": "multipart/form-data"

                }

            }

        }

    );

    return res.data;

};



// Delete Product

export const deleteProduct = async (

    productId

) => {

    const res = await deleteRequest(

        `/seller/products/${productId}`

    );

    return res.data;

};
