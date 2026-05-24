import axios from './axios.customize';

const API_PREFIX = "/api/auth";

export const verifyOtpApi = (data) => axios.post('/api/auth/verify-otp', data);

const createUserApi = (data) => {
    return axios.post(`${API_PREFIX}/register`, data);
}

const loginApi = (data) => {
    return axios.post(`${API_PREFIX}/login`, data);
}

const getProfileApi = (role = "USER") => {
    const endpoint = role === "ADMIN" ? "/admin/profile" : "/user/profile";
    return axios.get(`${API_PREFIX}${endpoint}`);
}

export {
    createUserApi,
    loginApi,
    getProfileApi
}