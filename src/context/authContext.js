import { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { login, register, verifyToken, logout as logoutApi } from '../api/auth';
import { setAuthFailureHandler } from '../api/axios';
import { clearAccessToken, hasAccessToken, setAccessToken } from '../api/token';
import { useUser } from '../hooks/useUser';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe estar dentro de un AuthProvider');
  }
  return context;
};

const persistSession = (data) => {
  const token = data?.accessToken ?? data?.token;
  if (token) {
    setAccessToken(token);
  }
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoading, isError } = useUser();
  const tokenPresent = hasAccessToken();

  const isAuthenticated = tokenPresent && !!user && !isError;

  useEffect(() => {
    setAuthFailureHandler(() => {
      clearAccessToken();
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
      navigate('/login', { replace: true });
    });

    return () => setAuthFailureHandler(null);
  }, [navigate, queryClient]);

  const signin = async (credentials) => {
    const data = await login(credentials);
    persistSession(data);

    if (data?.user) {
      queryClient.setQueryData(['user'], data.user);
    } else {
      await queryClient.fetchQuery({ queryKey: ['user'], queryFn: verifyToken });
    }

    return data;
  };

  const signup = async (userData) => {
    const data = await register(userData);
    persistSession(data);

    if (data?.user) {
      queryClient.setQueryData(['user'], data.user);
    } else {
      await queryClient.fetchQuery({ queryKey: ['user'], queryFn: verifyToken });
    }

    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // La sesión local se limpia aunque falle el endpoint remoto.
    } finally {
      clearAccessToken();
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: tokenPresent ? user : null,
        isLoading: tokenPresent && isLoading,
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
