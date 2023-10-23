import { lazy } from 'react';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Juridica from 'pages/extra-pages/Juridica/Juridica';
import PendientesUsuario from 'pages/extra-pages/PQRSPendientesUsuario/PendientesUsuario';
// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - utilities
const Radicados = Loadable(lazy(() => import('pages/components-overview/Radicados/Radicados')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'juridica',
      element: <Juridica />
    },
    {
      path: 'radicados',
      element: <Radicados />
    },
    {
      path: 'pendientes',
      element: <PendientesUsuario />
    }
  ]
};

export default MainRoutes;
