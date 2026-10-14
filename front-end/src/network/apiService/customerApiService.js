import customerAxios from "../axios/customerAxios";

export const getRequest = (

    url,

    {

        params = {},

        config = {}

    } = {}

) => {

    return customerAxios.get(

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

    return customerAxios.post(

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

    return customerAxios.put(

        url,

        data,

        config

    );

};

export const deleteRequest = (

    url,

    {

        data = {},

        config = {}

    } = {}

) => {

    return customerAxios.delete(

        url,

        {

            data,

            ...config

        }

    );

};

export const patchRequest = (
    url,
    {
        data = {},
        config = {}
    } = {}
) => {

    return customerAxios.patch(
        url,
        data,
        config
    );

};