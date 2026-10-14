import axios from "axios";
import getBaseURL from "../ApiConfig";

const baseURL = getBaseURL();
const customerAxios = axios.create({ baseURL, withCredentials: true, headers: { "Content-Type": "application/json" } });
const refreshApi = axios.create({ baseURL, withCredentials: true });
let sessionVersion = 0;
let refreshPromise = null;

if (typeof window !== "undefined") {
    window.addEventListener("customerSessionEnded", () => { sessionVersion += 1; refreshPromise = null; });
}

const isPublicCustomerRequest = (url = "") => /\/customer\/(login|register|logout|refresh-token|forgot-password\/)/.test(url);

customerAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("customerAccessToken");
    if (!token && !isPublicCustomerRequest(config.url)) {
        window.dispatchEvent(new Event("openCustomerAuthModal"));
        const error = new Error("Customer login is required.");
        error.code = "CUSTOMER_UNAUTHENTICATED";
        return Promise.reject(error);
    }
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        config._customerSessionVersion = sessionVersion;
    }
    return config;
});

customerAxios.interceptors.response.use(response => response, async (error) => {
    const original = error.config;
    if (!error.response || !original || error.response.status !== 401 || original._retry || isPublicCustomerRequest(original.url)) return Promise.reject(error);

    const currentToken = localStorage.getItem("customerAccessToken");
    const requestToken = original.headers?.Authorization?.replace(/^Bearer\s+/i, "");
    if (!currentToken || !requestToken || requestToken !== currentToken || original._customerSessionVersion !== sessionVersion) {
        return Promise.reject(error);
    }

    original._retry = true;
    const requestVersion = sessionVersion;
    try {
        if (!refreshPromise) {
            const pendingRefresh = refreshApi.post("/customer/refresh-token").then(res => res.data?.response?.accessToken);
            refreshPromise = pendingRefresh;
            pendingRefresh.then(
                () => { if (refreshPromise === pendingRefresh) refreshPromise = null; },
                () => { if (refreshPromise === pendingRefresh) refreshPromise = null; }
            );
        }
        const newAccessToken = await refreshPromise;
        const latestToken = localStorage.getItem("customerAccessToken");
        if (!newAccessToken || requestVersion !== sessionVersion ||
            (latestToken !== currentToken && latestToken !== newAccessToken)) {
            return Promise.reject(new Error("Customer session ended during token refresh."));
        }
        if (latestToken === currentToken) localStorage.setItem("customerAccessToken", newAccessToken);
        window.dispatchEvent(new CustomEvent("customerTokenRefreshed", { detail: newAccessToken }));
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${latestToken === newAccessToken ? latestToken : newAccessToken}`;
        original._customerSessionVersion = sessionVersion;
        return customerAxios(original);
    } catch (refreshError) {
        if (requestVersion === sessionVersion && localStorage.getItem("customerAccessToken") === currentToken) {
            localStorage.removeItem("customerAccessToken");
            localStorage.removeItem("customerProfileData");
            window.dispatchEvent(new Event("customerSessionExpired"));
        }
        return Promise.reject(refreshError);
    }
});

export default customerAxios;
