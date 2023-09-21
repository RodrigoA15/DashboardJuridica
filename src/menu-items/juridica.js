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
  id: 'juridica',
  title: 'Juridica',
  type: 'group',
  children: [
    {
      id: 'Juridica',
      title: 'Juridica',
      type: 'item',
      url: '/juridica',
      icon: icons.LayersIcon
    }
  ]
};

export default support;
