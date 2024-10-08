import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TablaVencidas from './TablaVencidas';
import { TablaTardias } from './TablaTardias';

export const TabVencidas = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab Vencidas">
            <Tab label="PQRS Vencidas" value="1" />
            <Tab label="Respuestas tardias" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <TablaVencidas />
        </TabPanel>
        <TabPanel value="2">
          <TablaTardias />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
