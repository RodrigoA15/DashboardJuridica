import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import PDFViewer from './PDFViewer';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import IndexTypesAffairs from './ActualizarAsunto/index';
import { Parameters } from 'hooks/useParameters';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
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
  } = useForm({ mode: 'onChange' });
  const [valueAffair, setValueAffair] = useState(null);
  const [url, setUrl] = useState('');
  const [urlFile, setUrlFile] = useState('');
  const onDrop = useCallback((acceptedFiles) => {
    setUrl(URL.createObjectURL(acceptedFiles[0]));
    setUrlFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/pdf': ['.pdf']
    }
  });

  const { parameters } = Parameters();

  const parametroActivo = parameters.some((parametro) => parametro.nombre_parametro === 'Asuntos respuesta' && parametro.activo === true);

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
      if (parametroActivo) {
        await crearRespuesta(num);
        await updateAffair();
      } else {
        await crearRespuesta(num);
      }
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
      formData.append('respuesta_pdf', urlFile);
      formData.append('fechaRespuesta', new Date());
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      await axios.post('/answer', formData, config);
      toast.success('Respuesta Agregada');
      setUrl('');
      handleClose();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  //Funcion actualizar asunto de la peticion (Atlantico)
  const updateAffair = async () => {
    try {
      await axios.put(`/typeAffair/${data.id_radicado._id}`, {
        id_asunto: valueAffair
      });
    } catch (error) {
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
                  Número radicado respuesta
                </label>
                <input
                  className="form-control rounded-pill"
                  type="number"
                  {...register('numero_radicado_respuesta', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio'
                    },
                    minLength: {
                      value: 12,
                      message: 'Número radicado respuesta debe ser minimo 12 carácteres'
                    }
                  })}
                />
                {errors.numero_radicado_respuesta && <span className="inputForm ">{errors.numero_radicado_respuesta.message}</span>}
              </div>
              {parameters.some((parametro) => parametro.nombre_parametro === 'Asuntos respuesta' && parametro.activo === true) && (
                <IndexTypesAffairs setValueAffair={setValueAffair} />
              )}

              <div
                className="mb-3"
                {...getRootProps()}
                style={{
                  background: '#e3e3e3',
                  padding: '20px'
                }}
              >
                <label className="form-label" htmlFor="NoRadicado">
                  Archivo
                </label>
                <input className="form-control rounded-pill" {...getInputProps()} />
                {isDragActive ? (
                  <p>Suelte el archivo aqui...</p>
                ) : (
                  <p>Arrastre y suelte archivo PDF aquí o haga clic para selecciona archivo</p>
                )}
              </div>
              {url && <PDFViewer url={url} />}

              {urlFile ? (
                <Button className="btn btn-success mt-4" type="submit">
                  Responder
                </Button>
              ) : (
                <span className="inputForm">Todos los campos son abligatorios</span>
              )}
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
  data: PropTypes.object,
  handleClose: PropTypes.func
};
