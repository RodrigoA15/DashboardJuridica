import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'context/authContext';
import LoaderComponent from 'components/LoaderComponent';

const LOGIN_PATH = '/login';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
