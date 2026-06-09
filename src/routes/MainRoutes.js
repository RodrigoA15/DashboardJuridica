import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Juridica from 'pages/extra-pages/Juridica/Juridica';
import PendientesUsuario from 'pages/extra-pages/PQRSPendientesUsuario/PendientesUsuario';
import UsuariosQX from 'pages/admin/UsuariosQX/index';
import PDFViewer from 'pages/extra-pages/PQRSPendientesUsuario/PDFViewer';
import Index from 'pages/admin/Asunto/index';
import IndexCE from 'pages/admin/CanalEntrada/index';
import IndexResumen from 'pages/admin/Resumen/index';
import TabViewComponent from 'pages/admin/Radicados/index';
import IndexParametros from 'pages/admin/Parametros/index';
import ProtectedRoute from 'ProtectedRoutes';
import config from 'config';
// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - utilities
const Radicados = Loadable(lazy(() => import('pages/components-overview/Radicados/Radicados')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />,
  children: [
    {
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={config.defaultPath} replace />
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
          path: 'pqrs',
          element: <Juridica />
        },
        {
          path: 'radicados',
          element: <Radicados />
        },
        {
          path: 'pendientes',
          element: <PendientesUsuario />
        },
        {
          path: 'radicadosAdmin',
          element: <TabViewComponent />
        },
        {
          path: 'usuariosqx',
          element: <UsuariosQX />
        },
        {
          path: 'pdfPQRS',
          element: <PDFViewer />
        },
        {
          path: 'asuntosAdmin',
          element: <Index />
        },
        {
          path: 'canalesAdmin',
          element: <IndexCE />
        },
        {
          path: 'resumenAdmin',
          element: <IndexResumen />
        },
        {
          path: 'parameters',
          element: <IndexParametros />
        }
      ]
    }
  ]
};

export default MainRoutes;
