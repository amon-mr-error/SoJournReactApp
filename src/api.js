import axios from "axios";
//process.env.REACT_APP_API_BASE ||

const API_BASE =  process.env.REACT_APP_API_BASE;

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const handleApiError = (error) => {
  if (error.response?.data?.msg) return error.response.data.msg;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return "Unknown error occurred";
};

export default api;