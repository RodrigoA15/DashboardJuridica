import { lazy } from 'react';
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
import TabViewComponent from 'pages/admin/index';
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
    }
  ]
};

export default MainRoutes;
