import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
import { login, register, verifyToken } from '../api/auth';
import { useUser } from '../hooks/useUser';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe estar dentro de un AuthProvider');
  }
  return context;
};

const getToken = () => Cookies.get('token');

const persistToken = (data) => {
  const token = data?.token ?? data?.accessToken;
  if (token) {
    Cookies.set('token', token, { path: '/' });
  }
};

const clearToken = () => {
  Cookies.remove('token');
  Cookies.remove('token', { path: '/' });
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, isLoading, isError } = useUser();
  const hasToken = !!getToken();

  const isAuthenticated = hasToken && !!user && !isError;

  const signin = async (credentials) => {
    const data = await login(credentials);
    persistToken(data);
    if (data?.user) {
      queryClient.setQueryData(['user'], data.user);
    } else {
      await queryClient.fetchQuery({ queryKey: ['user'], queryFn: verifyToken });
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await register(userData);
    persistToken(data);
    if (data?.user) {
      queryClient.setQueryData(['user'], data.user);
    } else {
      await queryClient.fetchQuery({ queryKey: ['user'], queryFn: verifyToken });
    }
    return data;
  };

  const logout = () => {
    clearToken();
    queryClient.setQueryData(['user'], null);
    queryClient.removeQueries({ queryKey: ['user'] });
  };

  return (
    <AuthContext.Provider
      value={{
        user: hasToken ? user : null,
        isLoading: hasToken && isLoading,
        isAuthenticated,
        signin,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
