import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../hooks/useUser';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe estar dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, isLoading, isError } = useUser();

  const logout = () => {
    Cookies.remove('token');
    queryClient.setQueryData(['user'], null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && !isError,
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
