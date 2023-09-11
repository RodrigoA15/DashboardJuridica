// assets
import { BarcodeOutlined } from '@ant-design/icons';

// icons
const icons = {
  BarcodeOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'Radicados',
  title: 'Radicados',
  type: 'group',
  children: [
    {
      id: 'util-shadow',
      title: 'Radicados',
      type: 'item',
      url: '/radicados',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default utilities;
