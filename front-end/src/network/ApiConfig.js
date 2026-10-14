const baseURL = "buyrsell/api";

// const getBaseURL = () => {
//   const host = window.location.hostname;

//   if (host === "localhost") {

//     return `http://localhost:5000/${baseURL}`;

// }

// return `https://YOUR_DOMAIN/${baseURL}`;

// };

const getBaseURL = () => {

    if (process.env.NODE_ENV === "development") {

        return "http://localhost:5000/buyrsell/api";

    }

    return process.env.REACT_APP_API_URL;

};

export default getBaseURL;

export const getSocketURL = () => {
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000";
  }

  
};