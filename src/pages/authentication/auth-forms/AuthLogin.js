import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/authContext';

// third party
import { Formik } from 'formik';
import LoaderComponent from 'components/LoaderComponent';

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
        <LoaderComponent />
      </Formik>
    </>
  );
};

export default AuthLogin;
