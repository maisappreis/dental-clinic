import axios from "axios";
import { apiBase } from "./base";

export const http = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${apiBase}/accounts/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem("accessToken", access);
          http.defaults.headers.Authorization = `Bearer ${access}`;

          return http(originalRequest);
        } catch (refreshError) {
          console.error(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);