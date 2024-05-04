import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.28.74:4000/api/v2',
  // baseURL: 'http://localhost:4000/api/v2',
  //Produccion
  // baseURL: 'https://pqrs-movit.onrender.com/api',
  withCredentials: true
});

export default instance;
