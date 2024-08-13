// project import
import { ThemeRoutes } from './routes/index';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useEffect } from 'react';
import { useAuth } from 'context/authContext';
import LoaderComponent from 'components/LoaderComponent';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const { checkLogin, loading } = useAuth();

  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) {
    return <LoaderComponent />; // Mostrar el loader mientras loading es true
  }

  return (
    <ThemeCustomization>
      <ScrollTop>
        <ThemeRoutes />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
