import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from 'context/authContext';
import LoaderComponent from 'components/LoaderComponent';
import config from 'config';

function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasToken = !!Cookies.get('token');

  if (hasToken && isLoading) {
    return <LoaderComponent />;
  }

  if (isAuthenticated) {
    return <Navigate to={config.defaultPath} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
