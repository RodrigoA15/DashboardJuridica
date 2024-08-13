import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export function ThemeRoutes() {
  return useRoutes([MainRoutes]);
}
