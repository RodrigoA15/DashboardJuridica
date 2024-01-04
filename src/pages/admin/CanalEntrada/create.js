import React, { useState } from 'react';
import axios from 'api/axios';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TableCell, TableRow } from '@mui/material';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

function CrearCanal({ toast }) {
  const [nombreCanal, setNombreCanal] = useState('');
  const [add, setAdd] = useState(false);
  const MySwal = withReactContent(Swal);
  const postApiCanal = async () => {
    try {
      const alert = await MySwal.fire({
        title: '¿Está seguro de crear el canal?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, crear'
      });

      if (alert.isConfirmed) {
        await axios.post('/canal/canal', {
          nombre_canal: nombreCanal
        });
        toast.success('Canal creado correctamente');
      }
      toast.error('Cancelado');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={() => setAdd(!add)}>
          <AddIcon />
        </IconButton>
        Crear canal de entrada
      </TableCell>

      <TableCell>
        {add && (
          <>
            <input className="form-control" onChange={(e) => setNombreCanal(e.target.value)} />
            <button title="Crear" className="btn btn-success mt-3" onClick={() => postApiCanal()}>
              Crear
            </button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default CrearCanal;

CrearCanal.propTypes = {
  toast: PropTypes.func
};
