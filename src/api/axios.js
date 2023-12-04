import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://192.168.28.74:4000/api',
  // baseURL: 'http://localhost:4000/api',
  //Produccion
  baseURL: 'https://pqrs-movit.onrender.com',
  withCredentials: true
});

export default instance;
