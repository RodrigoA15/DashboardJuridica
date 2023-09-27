// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// icons
const icons = {
  MoreHorizIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pendientes = {
  id: 'pendientes',
  title: 'Pendientes',
  type: 'group',
  children: [
    {
      id: 'pendientes',
      title: 'Pendientes',
      type: 'item',
      url: '/pendientes',
      icon: icons.MoreHorizIcon
    }
  ]
};

export default pendientes;
