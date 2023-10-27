// assets
import { QuestionOutlined } from '@ant-design/icons';
import LayersIcon from '@mui/icons-material/Layers';

// icons
const icons = {
  LayersIcon,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'pqrs',
  title: 'Pqrs',
  type: 'group',
  children: [
    {
      id: 'Pqrs',
      title: 'Pqrs',
      type: 'item',
      url: '/pqrs',
      icon: icons.LayersIcon
    }
  ]
};

export default support;
