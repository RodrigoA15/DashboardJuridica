//Modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
//Props
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Entidades from './Entidades';
import { Button } from '@mui/material';
import axios from 'api/axios';
//Context
import { useAuth } from 'context/authContext';
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

function Reasignaciones({ open, close, asignaciones, setAsignados }) {
  const [error, setError] = useState('');
  const [selectArea, setSelectArea] = useState('');
  const [selectEntidad, setSelectEntidad] = useState(null);
  const [selectAsunto, setSelectAsunto] = useState(''); // Estado para el asunto
  const [observacion, setObservacion] = useState('');
  const { user } = useAuth();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (!open) {
      setError('');
      setSelectArea('');
      setSelectEntidad(null);
      setSelectAsunto('');
      setObservacion('');
    }
  }, [open]);

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
          id_asunto: selectAsunto,
          estado_radicado: 'Pendiente',
          observaciones_radicado: message
        });
        toast.success('Reasignado correctamente');
        close();
      }
    } catch (error) {
      toast.error('Sucedió algo al realizar la reasignación');
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
    if (!selectArea || !selectAsunto || !observacion) {
      setError('Debe rellenar todos los campos');
      return;
    } else if (observacion.length <= 10) {
      setError('Observación debe ser mayor a 10 caracteres');
      return;
    }
    setError('');

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
      setAsignados((prev) => {
        if (!prev || !prev.data) return prev;
        return {
          ...prev,
          data: prev.data.filter((item) => item.id_radicado !== asignaciones.id_radicado)
        };
      });
      await updateRadicados();
      await updateEstadoAsignacion();
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Entidades
              setError={setError}
              selectArea={selectArea}
              setSelectArea={setSelectArea}
              selectEntidad={selectEntidad}
              setSelectEntidad={setSelectEntidad}
              selectAsunto={selectAsunto}
              setSelectAsunto={setSelectAsunto}
            />

            <textarea
              className="w-full max-w-md px-4 py-2 mt-2 bg-gray-100 border border-transparent rounded-lg text-gray-700"
              placeholder="Digite observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
            <span className="errors text-red-500 text-sm block mt-1">{error}</span>
          </form>
          <Button variant="contained" className="mt-4 w-full" onClick={handleButtonClick}>
            Actualizar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Reasignaciones;

Reasignaciones.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  asignaciones: PropTypes.object,
  setAsignados: PropTypes.func
};
