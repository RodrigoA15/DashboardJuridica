import React, { useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import { Modal, Box } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Toaster, toast } from 'sonner';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function ActualizarCanal({ open, handleClose, data }) {
  const [nombreCanal, setNombreCanal] = useState('');
  const MySwal = withReactContent(Swal);
  const updateCanal = async () => {
    try {
      const alert = await MySwal.fire({
        title: '¿Está seguro de actualizar el canal?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí. actualizar',
        customClass: {
          container: 'swal-zindex'
        }
      });

      if (alert.isConfirmed) {
        await axios.put(`/canal/canal/${data._id}`, {
          nombre_canal: nombreCanal
        });
        toast.success('Actualizado correctamente');
        handleClose();
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
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <label className="form-label h6" htmlFor="nombre">
            Nombre canal entrada
          </label>
          <input className="form-control border" onChange={(e) => setNombreCanal(e.target.value)} />
          <button className="btn btn-warning mt-2" onClick={() => updateCanal()}>
            Actualizar
          </button>
        </Box>
      </Modal>
    </>
  );
}

export default ActualizarCanal;

ActualizarCanal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object
};
