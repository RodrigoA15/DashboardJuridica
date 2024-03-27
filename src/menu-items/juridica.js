// assets
import { QuestionOutlined } from '@ant-design/icons';
import LayersIcon from '@mui/icons-material/Layers';
import DescriptionIcon from '@mui/icons-material/Description';

// icons
const icons = {
  LayersIcon,
  QuestionOutlined,
  DescriptionIcon
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
    },
    {
      id: 'resumen',
      title: 'Resumen',
      type: 'item',
      url: '/resumenAdmin',
      icon: icons.DescriptionIcon
    }
  ]
};

export default support;
