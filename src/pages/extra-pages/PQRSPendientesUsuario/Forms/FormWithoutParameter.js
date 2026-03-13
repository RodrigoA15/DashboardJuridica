import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useForm, useWatch } from 'react-hook-form'; // Importamos useWatch
import { toast } from 'sonner';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import PDFViewer from '../PDFViewer';
import { FormUpdateUser } from './FormUpdateUser';

const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FormWithoutParameter = ({ data, handleClose, dataAnswers }) => {
  const [url, setUrl] = useState('');
  const [urlFile, setUrlFile] = useState(null);
  const isReadOnly = data?.estado_radicado === 'Pendiente firma';
  const respuestaExistente = dataAnswers && dataAnswers.length > 0 ? dataAnswers[0] : null;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      numero_radicado_respuesta: respuestaExistente?.numero_radicado_respuesta || '',
      tipo_firma: respuestaExistente?.tipo_firma || '',
      requiere_firma: isReadOnly ? 'S' : 'N'
    }
  });

  useEffect(() => {
    if (dataAnswers && dataAnswers.length > 0) {
      const respuesta = dataAnswers[0];
      reset({
        numero_radicado_respuesta: respuesta.numero_radicado_respuesta,
        tipo_firma: respuesta.tipo_firma,
        requiere_firma: isReadOnly ? 'S' : 'N'
      });
    } else {
      reset({
        numero_radicado_respuesta: '',
        tipo_firma: '',
        requiere_firma: 'N'
      });
    }
  }, [dataAnswers, reset, isReadOnly]);

  const requiereFirma = useWatch({ control, name: 'requiere_firma' });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUrl(URL.createObjectURL(file));
      setUrlFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10000000
  });

  const MySwal = withReactContent(Swal);

  const crearRespuesta = async (formDataValues) => {
    try {
      const formData = new FormData();

      // Usamos los valores de la DB si es solo actualización, o del formulario si es nuevo
      const numero_radicado_respuesta = isReadOnly
        ? respuestaExistente?.numero_radicado_respuesta
        : formDataValues.numero_radicado_respuesta;

      const tipo_firma = isReadOnly ? respuestaExistente?.tipo_firma : formDataValues.tipo_firma;

      formData.append('numero_radicado_respuesta', numero_radicado_respuesta);
      formData.append('tipo_firma', tipo_firma);
      formData.append('requiere_firma', formDataValues.requiere_firma);
      formData.append('id_asignacion', data._id);
      formData.append('id_radicado', data.id_radicado);

      if (urlFile) {
        formData.append('respuesta_pdf', urlFile);
      }

      if (isReadOnly && respuestaExistente?._id) {
        await axios.put(`/answer/update-answer/${respuestaExistente._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Archivo adjuntado y radicado finalizado');
      } else {
        await axios.post('/answer', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(requiereFirma === 'S' ? 'Solicitud de firma enviada' : 'Respuesta creada con éxito');
      }

      setUrl('');
      setUrlFile(null);
      handleClose();
      reset();
    } catch (error) {
      toast.error(error.response?.data || 'Error al procesar la solicitud.');
      console.error(error);
    }
  };

  const onSubmit = handleSubmit(async (formDataValues) => {
    const isUpdating = isReadOnly && respuestaExistente;

    const alert = await MySwal.fire({
      title: isUpdating ? '¿Finalizar proceso de firma?' : '¿Confirmar registro?',
      text: isUpdating
        ? 'Se cargará el PDF firmado y se cerrará la gestión de este radicado.'
        : requiereFirma === 'S'
        ? 'Se enviará la solicitud de firma a Secretaría.'
        : 'Se registrará la respuesta definitiva.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal-zindex'
      },
      confirmButtonColor: isUpdating ? '#10B981' : '#3B82F6' // Verde si es finalizar, azul si es crear
    });

    if (alert.isConfirmed) {
      await crearRespuesta(formDataValues);
    }
  });

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numero_radicado_respuesta" className="block text-sm font-semibold text-gray-600 mb-2">
            Número radicado respuesta
          </label>
          <input
            id="numero_radicado_respuesta"
            className={`w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadOnly ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100'
            }`}
            type="number"
            disabled={isReadOnly}
            {...register('numero_radicado_respuesta', {
              required: 'Este campo es obligatorio',
              minLength: { value: 14, message: 'Mínimo 14 caracteres' }
            })}
          />
          {errors.numero_radicado_respuesta && (
            <span className="text-red-500 text-xs mt-1 block">{errors.numero_radicado_respuesta.message}</span>
          )}
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-gray-600 mb-2">¿Requiere firma de Secretaría?</legend>
          <div className="flex gap-6 pt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="firma_no"
                value="N"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                {...register('requiere_firma')}
                disabled={isReadOnly}
              />
              <label htmlFor="firma_no" className="ml-2 text-sm text-gray-700">
                No (Respuesta directa)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="firma_si"
                value="S"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                {...register('requiere_firma')}
                disabled={isReadOnly}
              />
              <label htmlFor="firma_si" className="ml-2 text-sm text-gray-700">
                Sí (Enviar a firma)
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend className="block text-sm font-semibold text-gray-600 mb-2">Tipo firma</legend>
          <div className="flex gap-6 pt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="mecanica"
                value="MECANICA"
                className="h-4 w-4 text-blue-600"
                disabled={isReadOnly}
                {...register('tipo_firma', {
                  required: !isReadOnly ? 'Seleccione un tipo' : false
                })}
              />
              <label htmlFor="mecanica" className="ml-3 text-sm text-gray-700">
                Mecánica
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="manual"
                value="MANUAL"
                className="h-4 w-4 text-blue-600"
                disabled={isReadOnly}
                {...register('tipo_firma', {
                  required: !isReadOnly ? 'Seleccione un tipo' : false
                })}
              />
              <label htmlFor="manual" className="ml-3 text-sm text-gray-700">
                Manual
              </label>
            </div>
          </div>
          {errors.tipo_firma && <span className="text-red-500 text-xs mt-2 block">{errors.tipo_firma.message}</span>}
        </fieldset>
      </div>

      {isReadOnly && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          <strong>Modo de Revisión:</strong> Este radicado está en espera de firma. Los datos no pueden ser editados.
        </div>
      )}

      <div>
        <FormUpdateUser data={data} />
      </div>

      {/* --- SECCIÓN DROPZONE: CONDICIONAL --- */}
      <div className={requiereFirma === 'S' && respuestaExistente === null ? 'opacity-50 pointer-events-none' : ''}>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Adjuntar Archivo PDF {requiereFirma === 'No' && <span className="text-red-500">*</span>}
        </label>
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'
          } hover:border-blue-400`}
        >
          <input {...getInputProps()} />
          <UploadIcon />
          <p className="mt-2 text-sm text-gray-600">
            {urlFile ? `Archivo seleccionado: ${urlFile.name}` : 'Arrastre el PDF firmado aquí para completar el proceso.'}
          </p>
        </div>
      </div>

      {url && <PDFViewer url={url} />}

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isReadOnly && !urlFile}
          className={`w-full md:w-60 font-bold py-3 px-6 rounded-lg transition-all shadow-md ${
            isReadOnly && !urlFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isReadOnly ? 'Completar y Firmar' : 'Crear Respuesta'}
        </button>
      </div>
    </form>
  );
};

FormWithoutParameter.propTypes = {
  data: PropTypes.object,
  handleClose: PropTypes.func,
  dataAnswers: PropTypes.array
};
