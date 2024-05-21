// project import
import dashboard from './dashboard';
import utilities from './utilities';
import support from './juridica';
import pendientes from './pendientesUsuario';
import admin from './admin';
import { useAuth } from 'context/authContext';

function GetMenuItems() {
  const { user } = useAuth();

  if (user && user.role && user.role.nombre_rol) {
    if (user.role.nombre_rol === 'Coordinador') {
      return {
        items: [dashboard, support, pendientes, utilities]
      };
    } else if (user.role.nombre_rol === 'admin') {
      return {
        items: [dashboard, utilities, support, pendientes, admin]
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
