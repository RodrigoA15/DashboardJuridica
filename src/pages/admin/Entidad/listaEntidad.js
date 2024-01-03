import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import axios from 'api/axios';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CrearEntidad from './create';
import UpdateEntidad from './update';

function ListaEntidad() {
  const [entidad, setEntidad] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    getEntidades();
  }, []);

  const getEntidades = async () => {
    try {
      const response = await axios.get('/entidad/entidad');
      setEntidad(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {entidad.map((entidades) => (
        <TableRow key={entidades._id}>
          <TableCell align="center">{entidades.nombre_entidad}</TableCell>
          {id === entidades._id && <UpdateEntidad id={id} setId={setId} />}
          <TableCell align="center">
            <IconButton color="warning" title="Actualizar" onClick={() => setId(entidades._id)}>
              <BorderColorIcon />
            </IconButton>
            <IconButton color="error" title="Eliminar">
              <DeleteIcon />
            </IconButton>
            <IconButton color="secondary" title="Crear" onClick={() => setOpenCreate(!openCreate)}>
              <AddIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
      {openCreate && <CrearEntidad />}
    </>
  );
}

export default ListaEntidad;
