import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  // baseURL: 'http://192.168.28.74:4000/api/v2',
  baseURL: 'http://localhost:4000/api/v2',
  //Produccion
  // baseURL: 'https://pqrs-movit.onrender.com/api',
  withCredentials: true
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
