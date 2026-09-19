import axios from 'axios';

export const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to inject JWT token into request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tradelog_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tradelog_token');
    }
    return Promise.reject(error);
  }
);
