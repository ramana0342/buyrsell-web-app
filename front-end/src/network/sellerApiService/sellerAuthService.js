import { postRequest, getRequest } from "../apiService/sellerApiService";

export const sellerRegister = async (data) => {
    const res = await postRequest("/seller/register", { data });
    return res.data;
};

export const sellerLogin = async (data) => {
    const res = await postRequest(
        "/seller/login",
        {
            data
        }
    );

    return res.data;
};

export const verifySellerEmail = async (token) => {
    const res = await getRequest(
        `/seller/verify-email?token=${token}`
    );

    return res.data;
};

export const resendVerificationEmail = async (data) => {
    const res = await postRequest(
        "/seller/resend-verification",
        {
            data
        }
    );

    return res.data;
};


export const forgotSellerPassword = async (data) => {

    const res = await postRequest(
        "/seller/forgot-password",
        {
            data
        }
    );

    return res.data;

};

export const resetSellerPassword = async (data) => {

    const res = await postRequest(
        "/seller/reset-password",
        {
            data
        }
    );

    return res.data;

};