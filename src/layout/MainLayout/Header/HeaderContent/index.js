// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
// import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';
import JsonToFileExcel from 'pages/components-overview/Radicados/JsonToXLSX';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <JsonToFileExcel />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
