// project import
import { ThemeRoutes } from './routes/index';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useEffect } from 'react';
import { useAuth } from 'context/authContext';
import LoaderComponent from 'components/LoaderComponent';
//Primereact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css

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
