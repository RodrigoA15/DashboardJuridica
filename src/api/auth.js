import axios from '../../node_modules/axios/index';

const API = 'http://localhost:4000/api';

export const register = (user) => axios.post(`${API}/auth/register`, user);

export const login = (user) => axios.post(`${API}/auth/login`, user);
