// project import

import { Box, Tab } from '@mui/material/index';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import GetPendientes from './GetPendientes';
import GetAsignados from './GetAsignados';
import GetRespuesta from './GetRespuesta';

// ==============================|| SAMPLE PAGE ||============================== //

const Juridica = () => {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Pendientes" value="1" />
            <Tab label="Asignados" value="2" />
            <Tab label="Respuestas" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <GetPendientes />
        </TabPanel>
        <TabPanel value="2">
          <GetAsignados />
        </TabPanel>
        <TabPanel value="3">
          <GetRespuesta />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Juridica;
