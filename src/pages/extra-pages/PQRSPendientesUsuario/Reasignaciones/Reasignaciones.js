//Modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
//Props
import PropTypes from 'prop-types';
import { useState } from 'react';
import Entidades from './Entidades';
import { Button } from '@mui/material';
import axios from 'api/axios';
//Context
import { useAuth } from 'context/authContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Toaster, toast } from 'sonner';
//Estilos modal
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

function Reasignaciones({ open, close, asignaciones }) {
  //Todo capturar errores
  const [error, setError] = useState('');
  const [selectArea, setSelectArea] = useState('');
  const [selectEntidad, setSelectEntidad] = useState(null);
  const [observacion, setObservacion] = useState('');
  const { user } = useAuth();
  const MySwal = withReactContent(Swal);
  //Actualizar modelo radicados
  const updateRadicados = async () => {
    try {
      if (asignaciones) {
        const message = `El usuario ${user.username} reasigno la petición ${
          asignaciones.numero_radicado
        } por motivo de ${observacion} con fecha de reasignacion ${new Date().toLocaleString()}`;
        const id_radicado = asignaciones.id_radicado;
        await axios.put(`/radicados/reasignacion/${id_radicado}`, {
          id_departamento: selectArea,
          id_entidad: selectEntidad,
          estado_radicado: 'Pendiente',
          observaciones_radicado: message
        });
        toast.success('Reasigando correctamente');
        close();
      }
    } catch (error) {
      toast.error('Error Sucedio algo al realizar la reasignacion');
    }
  };

  const updateEstadoAsignacion = async () => {
    try {
      if (asignaciones) {
        await axios.put(`/assigned/${asignaciones._id}`, {
          estado_asignacion: 'cerrado'
        });
      }
    } catch (error) {
      setError('No se pudo actualizar');
    }
  };

  const handleButtonClick = async () => {
    if (!selectArea) {
      setError('Debe rellenar todos los campos');
    } else if (!observacion) {
      setError('Debe rellenar todos los campos');
    } else {
      const alert = await MySwal.fire({
        title: '¿Está seguro de reasignar la petición?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, reasignar!',
        customClass: {
          container: 'swal-zindex'
        }
      });

      if (alert.isConfirmed) {
        updateRadicados();
        updateEstadoAsignacion();
      }
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <form>
            <Entidades
              setError={setError}
              selectArea={selectArea}
              setSelectArea={setSelectArea}
              selectEntidad={selectEntidad}
              setSelectEntidad={setSelectEntidad}
            />

            <textarea
              className="w-full max-w-md px-4 py-2 bg-gray-100 border border-transparent rounded-lg text-gray-700 text-center"
              placeholder="Digite observación"
              onChange={(e) => setObservacion(e.target.value)}
            />
            <span className="errors">{error}</span>
          </form>
          <Button onClick={() => handleButtonClick()}>Actualizar</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Reasignaciones;

Reasignaciones.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  asignaciones: PropTypes.object
};
