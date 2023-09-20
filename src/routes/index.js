import { useRoutes } from 'react-router-dom';

import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export function ThemeRoutes() {
  return useRoutes([LoginRoutes, MainRoutes]);
}
