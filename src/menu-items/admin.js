import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

//Icons
const icons = {
  AdminPanelSettingsIcon,
  GroupIcon,
  BusinessCenterIcon
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
    },
    {
      id: 'asuntos',
      title: 'Asuntos',
      type: 'item',
      url: 'asuntosAdmin',
      icon: icons.BusinessCenterIcon
    }
  ]
};

export default admin;
