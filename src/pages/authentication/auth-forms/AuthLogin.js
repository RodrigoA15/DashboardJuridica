import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/authContext';

// third party
import { Formik } from 'formik';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/default');
    } else {
      // navigate('/unauthorized');
      window.location.replace('http://localhost:5173/login');
    }
  }, [isAuthenticated]);

  return (
    <>
      <Formik>
        <h1>Cargando...</h1>
      </Formik>
    </>
  );
};

export default AuthLogin;
