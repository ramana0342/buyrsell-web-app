import sellerAxios from "../axios/sellerAxios";

export const getRequest = (

    url,

    {

        params = {},

        config = {}

    } = {}

) => {

    return sellerAxios.get(

        url,

        {

            params,

            ...config

        }

    );

};

export const postRequest = (

    url,

    {

        data = {},

        config = {}

    } = {}

) => {

    return sellerAxios.post(

        url,

        data,

        config

    );

};

export const putRequest = (

    url,

    {

        data = {},

        config = {}

    } = {}

) => {

    return sellerAxios.put(

        url,

        data,

        config

    );

};

export const patchRequest = (url, { data = {}, config = {} } = {}) =>
    sellerAxios.patch(url, data, config);

export const deleteRequest = (

    url,

    {

        data = {},

        config = {}

    } = {}

) => {

    return sellerAxios.delete(

        url,

        {

            data,

            ...config

        }

    );

};
