import GroupIcon from '@mui/icons-material/Group';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';

//Icons
const icons = {
  GroupIcon,
  BusinessCenterIcon,
  SendIcon,
  DescriptionIcon
};

const admin = {
  id: 'admin',
  title: 'Administrador',
  type: 'group',
  children: [
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
