import axios from "axios";
import getBaseURL from "../ApiConfig";


const sellerAxios = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


sellerAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("sellerAccessToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


const refreshApi = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});


sellerAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;


    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post("/seller/refresh-token");
        const newAccessToken = res.data.response.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        localStorage.setItem("sellerAccessToken", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return sellerAxios(originalRequest);

      } catch (err) {
        console.log("Refresh failed → logout seller");

        localStorage.removeItem("sellerAccessToken");

        localStorage.removeItem("sellerProfileData");

        window.dispatchEvent(
          new Event("sellerLogout")
        );

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default sellerAxios;