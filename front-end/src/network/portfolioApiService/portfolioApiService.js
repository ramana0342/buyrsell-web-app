import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "../apiService/publicApiService";

export const getUserContactMessagesCount = async()=>{
    let res = await getRequest("/user/contact-messages/count");
    return res.data;
}

export const postUserContact = async(data)=>{
    let res = await postRequest("/user/send-message",  {data: data});
    return res.data;
}

export const postAdminLogin = async(data)=>{
    let res = await postRequest("/admin/login",  {data: data});
    return res.data;
}

export const usersContactMessagesSearch = async(data)=>{
    let res = await postRequest("/user/contact-messages/search",  {data: data});
    return res.data;
}

export const deleteUserContactMessage = async(messageID)=>{
    let res = await deleteRequest(`/user/contact-messages/delete/${messageID}`);
    return res.data;
}

export const usersChatList = async()=>{
     let res = await getRequest("/chat/users-list");
    return res.data;
}

export const usersChatMessages = async(userId)=>{
     let res = await getRequest(`/chat/messages/${userId}`);
    return res.data;
}

export const adminLogout = async(userId)=>{
     let res = await postRequest(`/admin/logout`);
    return res.data;
}


export const sendOtp = async (data) => {
  let res = await postRequest("/admin/send-login-otp", { data });
 return res.data;
}


export const verifyOtp = async(data) => {
  let res = await postRequest("/admin/verify-login-otp", { data });
  return res.data;
}

export const askAI = async(data) => {
    let res = await postRequest("/ai/chat", { data });
    return res.data
}