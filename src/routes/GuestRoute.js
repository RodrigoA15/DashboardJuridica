import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'context/authContext';
import LoaderComponent from 'components/LoaderComponent';
import config from 'config';

function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isAuthenticated) {
    return <Navigate to={config.defaultPath} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
