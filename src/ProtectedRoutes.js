import { useAuth } from './context/authContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated, loading, user, setIsAuthenticated } = useAuth();

  if (loading) return <h1>Cargando...</h1>;
  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!user.departamento) {
    setIsAuthenticated(false);
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
