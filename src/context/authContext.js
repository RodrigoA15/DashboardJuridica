import { verifyToken } from 'api/auth';
import { useContext, useEffect } from 'react';
import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe de estar dentro de un provider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      setUser(null);
      return window.location.replace('http://localhost:5173/');
    }
    try {
      const res = await verifyToken(token);
      if (!res.data) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        loading,
        user,
        isAuthenticated,
        setIsAuthenticated,
        checkLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
