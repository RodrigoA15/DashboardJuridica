import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import PDFViewer from '../PDFViewer';
import { FormUpdateUser } from './FormUpdateUser';

// An SVG icon for the upload area
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

export const FormWithoutParameter = ({ data, handleClose }) => {
  const [url, setUrl] = useState('');
  const [urlFile, setUrlFile] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onChange' });

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
    maxSize: 10000000 // 10MB
  });

  const MySwal = withReactContent(Swal);

  const crearRespuesta = async (formDataValues) => {
    try {
      const formData = new FormData();
      formData.append('numero_radicado_respuesta', formDataValues.numero_radicado_respuesta);
      formData.append('concedido', null);
      formData.append('id_asignacion', data._id);
      formData.append('respuesta_pdf', urlFile);
      formData.append('fechaRespuesta', new Date().toISOString());

      await axios.post('/answer', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Respuesta agregada con éxito');
      setUrl('');
      setUrlFile(null);
      handleClose();
      reset();
    } catch (error) {
      toast.error('Error al crear la respuesta.');
      console.error(error);
    }
  };

  const onSubmit = handleSubmit(async (formDataValues) => {
    const alert = await MySwal.fire({
      title: '¿Confirmar respuesta?',
      text: 'Está a punto de agregar una nueva respuesta al radicado.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280'
    });

    if (alert.isConfirmed) {
      await crearRespuesta(formDataValues);
    } else {
      toast.info('Acción cancelada');
    }
  });

  return (
    // Use space-y to manage vertical spacing between form elements
    <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">
      <div>
        <label htmlFor="numero_radicado_respuesta" className="block text-sm font-semibold text-gray-600 mb-2">
          Número radicado respuesta
        </label>
        <input
          id="numero_radicado_respuesta"
          // Consistent styling for inputs
          className="w-80 px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          {...register('numero_radicado_respuesta', {
            required: { value: true, message: 'Este campo es obligatorio' },
            minLength: { value: 14, message: 'El número debe tener al menos 14 caracteres' }
          })}
        />
        {errors.numero_radicado_respuesta && (
          <span className="text-red-500 text-xs mt-1 block">{errors.numero_radicado_respuesta.message}</span>
        )}
      </div>

      <div>
        <FormUpdateUser data={data} />
      </div>

      <div>
        <label htmlFor="pdf" className="block text-sm font-semibold text-gray-600 mb-2">
          Adjuntar Archivo PDF
        </label>
        {/* Refactored Dropzone with Tailwind CSS */}
        <div
          {...getRootProps()}
          // Conditional styling for the dropzone area
          className={`
            p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragActive ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}
          `}
        >
          <input {...getInputProps()} />
          <UploadIcon />
          {isDragActive ? (
            <p className="mt-2 text-sm font-semibold text-blue-600">Suelte el archivo aquí...</p>
          ) : (
            <div>
              <p className="mt-2 text-sm text-gray-600">
                Arrastre y suelte un archivo PDF, o <span className="font-semibold text-blue-600">haga clic para seleccionar</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Tamaño máximo del archivo: 10 MB</p>
            </div>
          )}
        </div>
      </div>

      {url && <PDFViewer url={url} />}

      {/* Action button area */}
      <div className="pt-4 border-t border-gray-200">
        {urlFile ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            Responder
          </button>
        ) : (
          <p className="text-center text-sm text-gray-500">Debe adjuntar un archivo PDF para poder responder.</p>
        )}
      </div>
    </form>
  );
};

FormWithoutParameter.propTypes = {
  data: PropTypes.object,
  handleClose: PropTypes.func
};
