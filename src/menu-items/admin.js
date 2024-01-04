import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SendIcon from '@mui/icons-material/Send';

//Icons
const icons = {
  AdminPanelSettingsIcon,
  GroupIcon,
  BusinessCenterIcon,
  SendIcon
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
      title: 'Asuntos y entidades',
      type: 'item',
      url: 'asuntosAdmin',
      icon: icons.BusinessCenterIcon
    },
    {
      id: 'canal_entrada',
      title: 'Canales y áreas',
      type: 'item',
      url: 'canalesAdmin',
      icon: icons.SendIcon
    }
  ]
};

export default admin;
