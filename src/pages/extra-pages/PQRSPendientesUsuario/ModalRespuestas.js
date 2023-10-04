import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

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

function ModalRespuestas({ open, handleClose, data }) {
  const [radicadoRespuesta, setRadicadoRespuesta] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();
  const onSubmit = handleSubmit(() => {
    crearRespuesta(data._id, radicadoRespuesta);
  });

  const crearRespuesta = async (radicadoRespuesta) => {
    try {
      const MySwal = withReactContent(Swal);
      const alert = await MySwal.fire({
        title: 'Esta seguro de agregar la respuesta?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, responder',
        customClass: {
          container: 'swal-zindex'
        }
      });

      if (alert.isConfirmed) {
        await axios.post('/create_respuestas', {
          id_asignacion: data,
          numero_radicado_respuesta: radicadoRespuesta
        });
        toast.success('Respuestas Registrada');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      toast.error('error de servidor');
      console.log(error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {data && (
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="NoRadicado">
                  Numero Radicado
                </label>
                <input
                  className="form-control rounded-pill"
                  type="number"
                  onChange={(e) => {
                    setRadicadoRespuesta(e.target.value);
                  }}
                  {...register('radicado_respuesta', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio'
                    }
                  })}
                />
                {errors.radicado_respuesta && <span className="inputForm ">{errors.radicado_respuesta.message}</span>}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="NoRadicado">
                  Archivo
                </label>
                <input className="form-control rounded-pill" type="file" />
              </div>

              <Button type="submit">Responder</Button>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ModalRespuestas;
