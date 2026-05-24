import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");
    config.headers = config.headers ?? {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (!response) {
      return response;
    }

    if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
      return { ...response.data, status: response.status };
    }

    return {
      data: response.data,
      status: response.status
    };
  },
  function (error) {
    if (error?.response?.data && typeof error.response.data === "object") {
      return { ...error.response.data, status: error.response.status };
    }

    return Promise.reject(error);
  }
);

export default instance;