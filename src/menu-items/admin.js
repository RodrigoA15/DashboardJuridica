import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';

//Icons
const icons = {
  AdminPanelSettingsIcon,
  GroupIcon
};

const admin = {
  id: 'admin',
  title: 'Administrador',
  type: 'group',
  children: [
    {
      id: 'radicados',
      title: 'Radicados',
      type: 'item',
      url: '/radicadosAdmin',
      icon: icons.AdminPanelSettingsIcon
    },
    {
      id: 'usuariosqx',
      title: 'UsuariosQX',
      type: 'item',
      url: '/usuariosqx',
      icon: icons.GroupIcon
    }
  ]
};

export default admin;
