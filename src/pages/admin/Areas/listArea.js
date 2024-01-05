import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { TableCell, TableRow } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';

function ListArea({ toast }) {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    apiAreasData();
  }, []);

  const apiAreasData = async () => {
    try {
      const response = await axios.get('/departamentos/departamento');
      setAreas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraton áreas');
      } else {
        toast.error('error de servidor');
      }
    }
  };

  return (
    <>
      {areas.map((area) => (
        <TableRow key={area._id}>
          <TableCell>{area.nombre_departamento}</TableCell>
          <TableCell>
            <IconButton color="warning">
              <BorderColorIcon />
            </IconButton>

            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default ListArea;

ListArea.propTypes = {
  toast: PropTypes.func
};
