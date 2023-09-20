import axios from './axios';

export const register = (user) => axios.post(`/auth/register`, user);

export const login = (user) => axios.post(`/auth/login`, user);

export const verifyToken = () => axios.get('/auth/verify');
