// assets
import { BarcodeOutlined } from '@ant-design/icons';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// icons
const icons = {
  BarcodeOutlined,
  AdminPanelSettingsIcon
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'Radicados',
  title: 'Radicados',
  type: 'group',
  children: [
    {
      id: 'util-shadow',
      title: 'Ingresar radicados',
      type: 'item',
      url: '/radicados',
      icon: icons.BarcodeOutlined
    },

    {
      id: 'radicados',
      title: 'Radicados',
      type: 'item',
      url: '/radicadosAdmin',
      icon: icons.AdminPanelSettingsIcon
    }
  ]
};

export default utilities;
