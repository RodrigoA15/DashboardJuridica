import Unauthorized from 'pages/authentication/Unauthorized';
import { useAuth } from './context/authContext';
import { Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated, loading, user, setIsAuthenticated } = useAuth();

  if (loading) return <h1>Cargando...</h1>;
  if (!loading && !isAuthenticated) return <Unauthorized />;

  if (!user.departamento) {
    setIsAuthenticated(false);
    return <Unauthorized />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
