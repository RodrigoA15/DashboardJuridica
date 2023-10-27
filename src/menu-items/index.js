// project import
import dashboard from './dashboard';
import utilities from './utilities';
import support from './juridica';
import pendientes from './pendientesUsuario';
import { useAuth } from 'context/authContext';

function GetMenuItems() {
  const { user } = useAuth();

  if (user && user.role && user.role.nombre_rol) {
    if (user.role.nombre_rol === 'Coordinador') {
      return {
        items: [dashboard, utilities, support, pendientes]
      };
    } else {
      return {
        items: [dashboard, utilities, pendientes]
      };
    }
  } else {
    return {
      items: [dashboard, utilities, pendientes]
    };
  }
}

export default GetMenuItems;
