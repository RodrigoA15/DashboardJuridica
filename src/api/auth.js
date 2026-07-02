import axios from './axios';

export const register = async (user) => {
  const { data } = await axios.post('/auth/register', user);
  return data;
};

export const login = async (user) => {
  const { data } = await axios.post('/auth/login', user);
  return data;
};

export const logout = async () => {
  const { data } = await axios.post('/auth/logout');
  return data;
};

export const verifyToken = async () => {
  const { data } = await axios.get('/auth/verify');
  return data;
};
