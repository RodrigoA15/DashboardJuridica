import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { toast } from 'sonner';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import PDFViewer from '../PDFViewer';
import { FormUpdateUser } from './FormUpdateUser';
export const FormWithoutParameter = ({ data, handleClose }) => {
  const [url, setUrl] = useState('');
  const [urlFile, setUrlFile] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onChange' });
  const onDrop = useCallback((acceptedFiles) => {
    setUrl(URL.createObjectURL(acceptedFiles[0]));
    setUrlFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/pdf': ['.pdf']
    },
    maxSize: 10000000
  });

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
      formData.append('concedido', null);
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

  return (
    <>
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
                value: 14,
                message: 'Número radicado respuesta debe ser minimo 14 carácteres'
              }
            })}
          />
          {errors.numero_radicado_respuesta && <span className="inputForm ">{errors.numero_radicado_respuesta.message}</span>}

        </div>
        <div className="mb-3">
          <h6>Tipo firma</h6>
          <div className="d-flex gap-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="firmaDigital"
                onChange={(e) => setSignatureDigital(e.target.checked)}
                disabled={signatureManual}
              />
              <label className="form-check-label" htmlFor="firmaDigital">
                Firma digital
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="firmaManual"
                onChange={(e) => setSignatureManual(e.target.checked)}
                disabled={signatureDigital}
              />
              <label className="form-check-label" htmlFor="firmaManual">
                Firma manual
                </label>

                  </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="firmaMecanica"
                onChange={(e) => setSignatureManual(e.target.checked)}
                disabled={signatureMecanica}
              />
            
            </div>
          </div>
          {errors.firma && <div className="text-danger">{errors.firma.message}</div>}
        </div>

        <div>
          <FormUpdateUser data={data} />
        </div>

        <div>
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
              <div>
                <p>Arrastre y suelte archivo PDF aquí o haga clic para selecciona archivo</p>
                <p className="errors">Nota: el tamaño del archivo debe ser inferior a 10 MB</p>
              </div>
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
        </div>
      </form>
    </>
  );
};

FormWithoutParameter.propTypes = {
  data: PropTypes.object,
  handleClose: PropTypes.func
};
