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
  const [user, setUser] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');

  // const signup = async (user) => {
  //   try {
  //     const res = await register(user);
  //     setUser(res.data);
  //     setIsAuthenticated(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const signin = async (user) => {
  //   try {
  //     const res = await login(user);
  //     setIsAuthenticated(true);
  //     setUser(res.data);
  //   } catch (error) {
  //     if (error) {
  //       setError(error.response.data.message);
  //     }
  //     return;
  //   }
  // };

  const logout = () => {
    Cookies.remove('token');
    setUser('');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyToken(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        loading,
        user,
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired
};
