// import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// project-imports
// import CommonLayout from 'layout/CommonLayout';
// import Loadable from 'components/Loadable';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// render - landing page
// const PagesLanding = Loadable(lazy(() => import('pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  // return useRoutes([{ path: '/', element: <CommonLayout layout="landing" />,
  //   children: [
  //       {
  //         path: '/',
  //         element: <PagesLanding />
  //       }
  //     ]
  //   },
  //   LoginRoutes,
  //   ComponentsRoutes,
  //   MainRoutes
  // ]);
  return useRoutes([LoginRoutes, MainRoutes]);
}