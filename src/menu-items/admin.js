import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

//Icons
const icons = {
  AdminPanelSettingsIcon
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
    }
  ]
};

export default admin;
