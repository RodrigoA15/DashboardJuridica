import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { TableCell, TableRow } from '@mui/material';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import ActualizarCanal from './update';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
function ListCanales({ toast }) {
  const [canales, setCanales] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    dataCanales();
  }, []);

  const dataCanales = async () => {
    try {
      const response = await axios.get('/canal/canal');
      setCanales(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraton Canales de entrada');
      } else {
        toast.error('error de servidor');
      }
    }
  };

  const deleteCanal = async ({ _id }) => {
    try {
      const alert = await MySwal.fire({
        title: '¿Está seguro de eliminar el canal?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar'
      });

      if (alert.isConfirmed) {
        await axios.delete(`/canal/canal/${_id}`);
        toast.success('Eliminado');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpen(false);
  };
  return (
    <>
      {canales.map((canal) => (
        <TableRow key={canal._id}>
          <TableCell>{canal.nombre_canal}</TableCell>
          <TableCell>
            <IconButton color="warning" onClick={() => handleOpen(canal)}>
              <BorderColorIcon />
            </IconButton>
            <IconButton color="error" onClick={() => deleteCanal(canal)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
      <ActualizarCanal open={open} handleClose={handleClose} data={selectedData} />
    </>
  );
}

export default ListCanales;

ListCanales.propTypes = {
  toast: PropTypes.func
};
