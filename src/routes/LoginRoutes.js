import { lazy } from 'react';

// project import

import Loadable from 'components/Loadable';
import Unauthorized from 'pages/authentication/Unauthorized';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  children: [
    {
      path: '/',
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'unauthorized',
          element: <Unauthorized />
        }
      ]
    }
  ]
};

export default LoginRoutes;
