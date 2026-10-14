import {
    getRequest
} from "../apiService/publicApiService";



export const getAllProducts = async (params = {}, config = {}) => {

    const res = await getRequest("/products", { params, config });

    return res.data;

};

export const getHomepageCategoryProducts = async () => {
    const res = await getRequest("/products", { params: { homeCategories: true } });
    return res.data;
};

export const getProductDetails = async (slug) => {

    const res = await getRequest(`/products/${slug}`);

    return res.data;

};
