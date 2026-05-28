// material-ui
import { Box } from '@mui/material';

import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <SimpleBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Navigation />
      </SimpleBar>
    </Box>

    <Box sx={{ mt: 'auto', p: 2, textAlign: 'center' }}>
      <p className='font-semibold text-xs'>Powered by Quipux Popay&aacute;n</p>
      <p className='text-xs'>&copy; {new Date().getFullYear()}</p>
    </Box>
  </Box>
);

export default DrawerContent;
