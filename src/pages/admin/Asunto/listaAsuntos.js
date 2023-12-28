import { useEffect, useMemo, useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'api/axios';

export default function ListaAsuntos() {
  const [openAreas, setOpenAreas] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    apiDataAsuntos();
  }, []);

  const handleClick = (areaIndex) => {
    setOpenAreas((prevOpenAreas) => {
      const newOpenAreas = [...prevOpenAreas];
      newOpenAreas[areaIndex] = !newOpenAreas[areaIndex];
      return newOpenAreas;
    });
  };

  const apiDataAsuntos = async () => {
    try {
      const response = await axios.get('/asunto/asunto');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    apiDataAsuntos();
  }, []);

  return (
    <List
      sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Asuntos por área
        </ListSubheader>
      }
    >
      {data.map((area, index) => (
        <div key={area.nombre_departamento}>
          <ListItemButton onClick={() => handleClick(index)}>
            <ListItemText primary={area.nombre_departamento} />
            {openAreas[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAreas[index]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {area.asuntos.map((asunto) => (
                <ListItemButton key={asunto._id} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <FiberManualRecordIcon />
                  </ListItemIcon>
                  <ListItemText primary={asunto.nombre_asunto} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
}
