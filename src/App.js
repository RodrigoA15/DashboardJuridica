// project import
import { ThemeRoutes } from './routes/index';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
//Primereact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import LoaderComponent from 'components/LoaderComponent';
import { useAuth } from 'context/authContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const { isLoading } = useAuth();
  if (isLoading) {
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
