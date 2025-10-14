import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { TablaTardias } from '../vencidas/TablaTardias';
import { TablePQRSExpired } from './TablePQRSExpired';

export const TabVencidas = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 md:p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-800">PQRS Vencidas y por vencer</h3>
      </div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab Vencidas">
              <Tab label="PQRS Vencidas" value="1" />
              <Tab label="Respuestas tardias" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TablePQRSExpired />
          </TabPanel>
          <TabPanel value="2">
            <TablaTardias />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
