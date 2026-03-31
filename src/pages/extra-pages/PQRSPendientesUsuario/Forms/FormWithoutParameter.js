import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import PDFViewer from '../PDFViewer';
import { FormUpdateUser } from './FormUpdateUser';

const MySwal = withReactContent(Swal);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const STATUS_PENDIENTE_FIRMA = 'Pendiente firma';
const REQ_FIRMA_SI = 'S';
const REQ_FIRMA_NO = 'N';

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

  const isReadOnly = data?.estado_radicado === STATUS_PENDIENTE_FIRMA;
  const respuestaExistente = dataAnswers?.[0] || null;

  // 1. FIX: Agregamos defaultValues. Es una regla de oro en Clean Code con RHF
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    control
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      numero_radicado_respuesta: isReadOnly ? respuestaExistente?.numero_radicado_respuesta : '',
      requiere_firma: null,
      tipo_firma: null
    }
  });

  const requiereFirma = useWatch({ control, name: 'requiere_firma' });

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

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
    maxSize: MAX_FILE_SIZE_BYTES
  });

  const crearRespuesta = async (formDataValues) => {
    try {
      const formData = new FormData();
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
        toast.success(requiereFirma === REQ_FIRMA_SI ? 'Solicitud de firma enviada' : 'Respuesta creada con éxito');
      }

      setUrl('');
      setUrlFile(null);
      handleClose();
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud.');
    }
  };

  const onSubmit = handleSubmit(async (formDataValues) => {
    const isUpdating = isReadOnly && respuestaExistente;

    if (!isReadOnly && requiereFirma === REQ_FIRMA_NO && !urlFile) {
      toast.error('Debe adjuntar el archivo PDF para la respuesta directa.');
      return;
    }

    const alert = await MySwal.fire({
      title: isUpdating ? '¿Finalizar proceso de firma?' : '¿Confirmar registro?',
      text: isUpdating
        ? 'Se cargará el PDF firmado y se cerrará la gestión de este radicado.'
        : requiereFirma === REQ_FIRMA_SI
          ? 'Se enviará la solicitud de firma a Secretaría.'
          : 'Se registrará la respuesta definitiva.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal-zindex'
      },
      confirmButtonColor: isUpdating ? '#10B981' : '#3B82F6'
    });

    if (alert.isConfirmed) {
      await crearRespuesta(formDataValues);
    }
  });

  // 2. FIX: Función validadora a prueba de balas extraída para no repetir código
  const validateTipoFirma = (value) => {
    // Si no es de lectura y el valor está vacío, disparamos el error
    if (!isReadOnly && !value) {
      return "Seleccione un tipo de firma";
    }
    return true; // Pasa la validación
  };

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numero_radicado_respuesta" className="block text-sm font-semibold text-gray-600 mb-2">
            Número radicado respuesta
          </label>
          <input
            id="numero_radicado_respuesta"
            className={`w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100'}`}
            type="number"
            disabled={isReadOnly || isSubmitting}
            {...register('numero_radicado_respuesta', {
              required: 'Este campo es obligatorio',
              minLength: { value: 14, message: 'Mínimo 14 caracteres' }
            })}
          />
          {errors.numero_radicado_respuesta && (
            <span className="text-red-500 text-xs mt-1 block font-medium">{errors.numero_radicado_respuesta.message}</span>
          )}
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-gray-600 mb-2">
            ¿Requiere firma de Secretaría? {!isReadOnly && <span className="text-red-500">*</span>}
          </legend>
          <div className="flex gap-6 pt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="firma_no"
                value={REQ_FIRMA_NO}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={isReadOnly || isSubmitting}
                {...register('requiere_firma', {
                  validate: (val) => !isReadOnly && !val ? "Seleccione una opción" : true
                })}
              />
              <label htmlFor="firma_no" className="ml-2 text-sm text-gray-700 cursor-pointer">
                No (Respuesta directa)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="firma_si"
                value={REQ_FIRMA_SI}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={isReadOnly || isSubmitting}
                {...register('requiere_firma', {
                  validate: (val) => !isReadOnly && !val ? "Seleccione una opción" : true
                })}
              />
              <label htmlFor="firma_si" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Sí (Enviar a firma)
              </label>
            </div>
          </div>
          {/* Añadimos visualización del error para requiere_firma por buena práctica */}
          {errors.requiere_firma && (
            <span className="text-red-500 text-xs mt-2 block font-medium">{errors.requiere_firma.message}</span>
          )}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend className="block text-sm font-semibold text-gray-600 mb-2">
            Tipo firma {!isReadOnly && <span className="text-red-500">*</span>}
          </legend>
          <div className="flex gap-6 pt-2">

            {/* 3. FIX: Aplicar la validación idéntica a AMBOS inputs */}
            <div className="flex items-center">
              <input
                type="radio"
                id="mecanica"
                value="MECANICA"
                className="h-4 w-4 text-blue-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={isReadOnly || isSubmitting}
                {...register('tipo_firma', { validate: validateTipoFirma })}
              />
              <label htmlFor="mecanica" className="ml-3 text-sm text-gray-700 cursor-pointer">
                Mecánica
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="manual"
                value="MANUAL"
                className="h-4 w-4 text-blue-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={isReadOnly || isSubmitting}
                {...register('tipo_firma', { validate: validateTipoFirma })}
              />
              <label htmlFor="manual" className="ml-3 text-sm text-gray-700 cursor-pointer">
                Manual
              </label>
            </div>

          </div>

          {/* Mensaje de error garantizado */}
          {errors.tipo_firma && (
            <span className="text-red-500 text-xs mt-2 block font-medium">
              {errors.tipo_firma.message}
            </span>
          )}
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

      <div className={requiereFirma === REQ_FIRMA_SI && 'opacity-50 pointer-events-none'}>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Adjuntar Archivo PDF {requiereFirma === REQ_FIRMA_NO && <span className="text-red-500">*</span>}
        </label>
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'} hover:border-blue-400`}
        >
          <input {...getInputProps()} disabled={isSubmitting} />
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
          disabled={(isReadOnly && !urlFile) || isSubmitting}
          className={`w-full md:w-60 font-bold py-3 px-6 rounded-lg transition-all shadow-md flex justify-center items-center ${(isReadOnly && !urlFile) || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {isSubmitting ? 'Procesando...' : isReadOnly ? 'Completar y Firmar' : 'Crear Respuesta'}
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