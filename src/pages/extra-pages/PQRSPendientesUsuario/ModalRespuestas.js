import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { useForm } from 'react-hook-form';

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

  const onSubmit = handleSubmit(async (num) => {
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
      crearRespuesta(num);
      savedFiles(num);
      console.log(num);
      reset();
      toast.success('Registrado con exito');
    } else {
      toast.error('Cancelado');
    }
  });

  const crearRespuesta = async (num) => {
    const numero_radicado_respuesta = num.numero_radicado_respuesta;

    try {
      await axios.post('/create_respuestas', { numero_radicado_respuesta, id_asignacion: data._id });
    } catch (error) {
      toast.error('error de servidor');
      console.log(error);
    }
  };

  const savedFiles = async (num) => {
    try {
      const formData = new FormData();
      formData.append('respuesta_pdf', num.respuesta_pdf[0]);
      await axios.post('/filepdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Archivo cargado correctamente');
    } catch (error) {
      toast.error('No se pudo cargar el archivo');
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
