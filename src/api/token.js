import Cookies from 'js-cookie';

export const ACCESS_TOKEN_KEY = 'accessToken';

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  if (token) {
    Cookies.set(ACCESS_TOKEN_KEY, token, { path: '/' });
  }
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
};

export const hasAccessToken = () => !!getAccessToken();
