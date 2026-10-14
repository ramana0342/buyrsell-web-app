import publicAxios from "../axios/publicAxios";

export const getRequest = (url, { params = {}, config = {} } = {}) =>
    publicAxios.get(url, {
        params,
        ...config
    });

export const postRequest = (url, { data = {}, config = {} } = {}) =>
    publicAxios.post(url, data, config);

export const putRequest = (url, { data = {}, config = {} } = {}) =>
    publicAxios.put(url, data, config);

export const deleteRequest = (url, { data = {}, config = {} } = {}) =>
    publicAxios.delete(url, {
        data,
        ...config
    });