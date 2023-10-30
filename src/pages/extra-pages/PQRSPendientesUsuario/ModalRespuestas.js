import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

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
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm();
  const MySwal = withReactContent(Swal);

  const onSubmit = handleSubmit(async (num) => {
    const alert = await MySwal.fire({
      title: 'Esta seguro de agregar respuesta?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, agregar',
      customClass: {
        container: 'swal-zindex'
      }
    });

    if (alert.isConfirmed) {
      await crearRespuesta(num);
    } else {
      toast.error('Respuesta Cancelada');
    }
    reset();
  });

  const crearRespuesta = async (num) => {
    try {
      const numero_radicado_respuesta = num.numero_radicado_respuesta;
      const formData = new FormData();
      formData.append('numero_radicado_respuesta', numero_radicado_respuesta);
      formData.append('id_asignacion', data._id);
      formData.append('respuesta_pdf', num.respuesta_pdf[0]);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      await axios.post('/create_respuestas', formData, config);
      toast.success('Respuesta Agregada');
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
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label" htmlFor="NoRadicado">
                  Numero Radicado
                </label>
                <input
                  className="form-control rounded-pill"
                  type="number"
                  {...register('numero_radicado_respuesta', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio'
                    }
                  })}
                />
                {errors.numero_radicado_respuesta && <span className="inputForm ">{errors.numero_radicado_respuesta.message}</span>}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="NoRadicado">
                  Archivo
                </label>
                <input
                  name="respuesta_pdf"
                  className="form-control rounded-pill"
                  accept=".pdf"
                  type="file"
                  {...register('respuesta_pdf', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio'
                    }
                  })}
                />
                {errors.respuesta_pdf && <span className="inputForm ">{errors.respuesta_pdf.message}</span>}
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

ModalRespuestas.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.func,
  handleClose: PropTypes.func
};
