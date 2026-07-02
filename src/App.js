import { useLocation } from 'react-router-dom';
// project import
import { ThemeRoutes } from './routes/index';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
//Primereact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import LoaderComponent from 'components/LoaderComponent';
import { useAuth } from 'context/authContext';

const PUBLIC_PATHS = ['/login', '/register', '/unauthorized'];

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const { isLoading } = useAuth();
  const location = useLocation();
  const isPublicRoute = PUBLIC_PATHS.some((path) => location.pathname.endsWith(path));

  if (isLoading && !isPublicRoute) {
    return <LoaderComponent />;
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
