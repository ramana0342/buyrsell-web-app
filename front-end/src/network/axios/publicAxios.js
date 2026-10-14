import axios from "axios";

import getBaseURL from "../ApiConfig";

const publicAxios = axios.create({

    baseURL: getBaseURL(),

    withCredentials: true,

    headers: {

        "Content-Type": "application/json"

    }

});

export default publicAxios;