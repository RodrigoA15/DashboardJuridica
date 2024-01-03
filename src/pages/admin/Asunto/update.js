import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function Updateasunto({ asuntoId, setAsuntoId, asunto }) {
  //Valor input actualizar asunto
  const [nombre_asunto, setNombre_asunto] = useState('');
  const updateAsunto = async ({ _id }) => {
    try {
      const MySwal = withReactContent(Swal);
      const alert = await MySwal.fire({
        title: 'Esta seguro de actualizar el asunto',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      });

      if (alert.isConfirmed) {
        await axios.put(`/asunto/asunto/${_id}`, {
          nombre_asunto: nombre_asunto
        });
        toast.success('Actualizado');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      {asuntoId === asunto._id ? (
        <>
          <input className="form-control mb-1" type="text" value={nombre_asunto} onChange={(e) => setNombre_asunto(e.target.value)} />
          <button className="btn btn-warning m-1" onClick={() => updateAsunto(asunto)}>
            Actualizar
          </button>
          <button className="btn btn-secondary m-1" onClick={() => setAsuntoId(null)}>
            Cancelar
          </button>
        </>
      ) : (
        <TableCell>{asunto.nombre_asunto}</TableCell>
      )}
    </div>
  );
}

export default Updateasunto;

Updateasunto.propTypes = {
  asuntoId: PropTypes.string,
  setAsuntoId: PropTypes.func,
  asunto: PropTypes.object
};
