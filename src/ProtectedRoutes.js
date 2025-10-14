import { useAuth } from 'context/authContext';
import { Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (!isAuthenticated) {
    // Redirección a login externo
    window.location.href = 'http://localhost:5173/dashboard/login';
    return null;
  }

  return <Outlet />;
}

export default ProtectedRoute;
