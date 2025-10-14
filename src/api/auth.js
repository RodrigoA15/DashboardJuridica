import axios from './axios';

// Registro de usuario
export const register = async (user) => {
  const { data } = await axios.post('/auth/register', user);
  return data;
};

// Login de usuario
export const login = async (user) => {
  const { data } = await axios.post('/auth/login', user);
  return data;
};

export const verifyToken = async () => {
  const { data } = await axios.get('/auth/verify');
  return data;
};
