import { useAuth } from 'context/authContext';
import PropTypes from 'prop-types'; // Asegúrate de importar esto

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (!isAuthenticated && !isLoading) {
    window.location.href = 'http://localhost:5173/dashboard/login';
    return null;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
