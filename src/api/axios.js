import axios from 'axios';
import { clearAccessToken, getAccessToken, setAccessToken } from './token';

const instance = axios.create({
  // baseURL: 'http://192.168.28.74:4000/api/v2',
  baseURL: 'http://localhost:4000/api/v2',
  // Produccion
  // baseURL: 'https://pqrs-movit.onrender.com/api',
  withCredentials: true
});

const refreshClient = axios.create({
  baseURL: instance.defaults.baseURL,
  withCredentials: true
});

const AUTH_SKIP_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/logout'];

let isRefreshing = false;
let failedQueue = [];
let onAuthFailure = null;

const shouldSkipRefresh = (url = '') => AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path));

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const setAuthFailureHandler = (handler) => {
  onAuthFailure = handler;
};

const handleAuthFailure = () => {
  clearAccessToken();
  onAuthFailure?.();
};

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post('/auth/refresh-token');
      const newToken = data?.accessToken;

      if (!newToken) {
        throw new Error('No se recibió un access token válido');
      }

      setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleAuthFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
