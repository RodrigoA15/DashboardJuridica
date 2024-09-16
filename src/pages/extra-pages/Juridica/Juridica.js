// project import

import { Box, Tab } from '@mui/material/index';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import GetPendientes from './GetPendientes';
import GetAsignados from './GetAsignados';
import GetRespuesta from './GetRespuesta';
import Preasignaciones from '../PQRSPreasignadas/Preasignaciones';
import { List, ListItem, Stack, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { GetAssignedUser } from './GetAssignedUser';

// ==============================|| SAMPLE PAGE ||============================== //

const Juridica = () => {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <List component="nav" aria-label="Horizontal List">
        <ListItem sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Stack direction="row" alignItems="center" sx={{ marginRight: 5 }}>
            <Dot color="success" />
            <Typography> 0-5 Dias</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ marginRight: 5 }}>
            <Dot color="warning" className="m-1" />
            <Typography> 6-9 Dias</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ marginRight: 5 }}>
            <Dot color="info" sx={{ margin: 5 }} />
            <Typography> 10-12 Dias</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Dot color="error" />
            <Typography> +13 Dias</Typography>
          </Stack>
        </ListItem>
      </List>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Pre-asignacion" value="1" />
            <Tab label="Pendientes" value="2" />
            <Tab label="Asignados" value="3" />
            <Tab label="Respuestas" value="4" />
            <Tab label="Asignados usuario" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Preasignaciones />
        </TabPanel>
        <TabPanel value="2">
          <GetPendientes />
        </TabPanel>
        <TabPanel value="3">
          <GetAsignados />
        </TabPanel>
        <TabPanel value="4">
          <GetRespuesta />
        </TabPanel>
        <TabPanel value="5">
          <GetAssignedUser />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Juridica;
