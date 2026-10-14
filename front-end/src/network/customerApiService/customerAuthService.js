import {

    postRequest

} from "../apiService/customerApiService";
import publicAxios from "../axios/publicAxios";

export const customerRegister = async (data) => {

    const res = await postRequest(

        "/customer/register",

        {

            data

        }

    );

    return res.data;

};

export const customerLogin = async (data) => {

    const res = await postRequest(

        "/customer/login",

        {

            data

        }

    );

    return res.data;

};

export const customerLogout = async () => {

    const res = await publicAxios.post("/customer/logout");

    return res.data;

};

export const sendEmailOtp = async () => {

    const res = await postRequest(

        "/customer/send-email-otp"

    );

    return res.data;

};

export const verifyEmailOtp = async (data) => {

    const res = await postRequest(

        "/customer/verify-email-otp",

        {

            data

        }

    );

    return res.data;

};

export const resendEmailOtp = async () => {

    const res = await postRequest(

        "/customer/resend-email-otp"

    );

    return res.data;

};

export const refreshCustomerToken = async () => {

    const res = await postRequest(

        "/customer/refresh-token"

    );

    return res.data;

};


export const sendPasswordResetOtp = async (
    data
) => {

    const res = await postRequest(

        "/customer/forgot-password/send-otp",

        {
            data
        }

    );

    return res.data;

};

export const verifyPasswordResetOtp = async (
    data
) => {

    const res = await postRequest(

        "/customer/forgot-password/verify-otp",

        {
            data
        }

    );

    return res.data;

};

export const resetCustomerPassword = async (
    data
) => {

    const res = await postRequest(

        "/customer/forgot-password/reset",

        {
            data
        }

    );

    return res.data;

};
