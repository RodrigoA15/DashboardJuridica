import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import axios from 'api/axios';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CrearEntidad from './create';
import UpdateEntidad from './update';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';
function ListaEntidad() {
  const [entidad, setEntidad] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [id, setId] = useState(null);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    getEntidades();
  }, []);

  const getEntidades = async () => {
    try {
      const response = await axios.get('/entity');
      setEntidad(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraton entidades');
      } else {
        toast.error('Algo sucedio al intentar mostrar', { description: 'error de servidor' });
      }
    }
  };

  const deleteEntidad = async ({ _id }) => {
    try {
      const alert = await MySwal.fire({
        title: 'Está seguro de eliminar la entidad?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar'
      });

      if (alert.isConfirmed) {
        await axios.delete(`/entity/${_id}`);
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      {entidad.map((entidades) => (
        <TableRow key={entidades._id}>
          <TableCell align="center">{entidades.nombre_entidad}</TableCell>
          {id === entidades._id && <UpdateEntidad id={id} setId={setId} />}
          <TableCell align="center">
            <IconButton color="warning" title="Actualizar" onClick={() => setId(entidades._id)}>
              <BorderColorIcon />
            </IconButton>
            <IconButton color="error" title="Eliminar" onClick={() => deleteEntidad(entidades)}>
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
