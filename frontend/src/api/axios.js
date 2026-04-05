import axios from 'axios';
const rawBaseURL = import.meta.env.VITE_API_URL || '/api';
const baseURL = rawBaseURL.startsWith('http')
  ? (rawBaseURL.match(/\/api\/?$/)
    ? rawBaseURL.replace(/\/$/, '')
    : `${rawBaseURL.replace(/\/$/, '')}/api`)
  : rawBaseURL.replace(/\/$/, '');

const backendBaseURL = baseURL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ledgera_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ledgera_token');
      localStorage.removeItem('ledgera_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiBaseURL = baseURL;
export const backendRootURL = backendBaseURL;
export default api;
