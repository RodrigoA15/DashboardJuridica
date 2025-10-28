import { useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Juzgados from './Juzgados';
import { ModalCreateLegal } from './ModalCreateLegal';

// Ícono de Búsqueda en formato SVG para reemplazar el de MUI
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function Buscador({ setProcedencia, setNameCourt, nameCourt, setJuzgados }) {
  const [numero_identificacion, setNumero_identificacion] = useState('');
  const [procedenciaData, setProcedenciaData] = useState([]);
  const [entrada, setEntrada] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: { search: '' }
  });

  const GetidentificacionById = async () => {
    if (numero_identificacion.trim() === '') {
      return toast.error('El campo de búsqueda no puede estar vacío.');
    }
    try {
      const response = await axios.get(`/origin/${numero_identificacion}`);
      if (response.data.length > 0) {
        setProcedenciaData(response.data);
        setProcedencia(response.data[0]._id);
        setEntrada(true);
        toast.success('Usuario encontrado.');
      } else {
        setEntrada(false);
        // Si no se encuentra, el catch manejará el 404
      }
    } catch (error) {
      setEntrada(false);
      if (error.response && error.response.status === 404) {
        toast.error('Usuario no registrado', {
          description: 'Por favor, complete el formulario para registrarlo.',
          duration: 6000
        });
      } else {
        toast.error(error.message || 'Ocurrió un error inesperado.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      GetidentificacionById();
    }
  };

  const PostProcedencia = async (data) => {
    try {
      await axios.post('/origin', { ...data, numero_identificacion });
      toast.success('Usuario registrado con éxito', {
        description: 'Realizando búsqueda nuevamente...',
        duration: 4000
      });
      GetidentificacionById();
      reset();
    } catch (error) {
      toast.error(error.response?.data || 'Error al registrar.');
    }
  };

  const onSubmit = handleSubmit(PostProcedencia);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Información del Usuario</h2>

      {/* --- Buscador --- */}
      <div className="w-full md:w-2/3 lg:w-1/2">
        <label htmlFor="search" className="block text-sm font-semibold text-gray-600 mb-2">
          Buscar por identificación
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            id="search"
            type="number"
            placeholder="Digite identificación y presione Enter"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            {...register('search', {
              required: { value: true, message: 'El campo no puede estar vacío' },
              minLength: { value: 5, message: 'Debe tener al menos 5 caracteres' }
            })}
            onChange={(e) => setNumero_identificacion(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        {errors.search && <span className="text-red-500 text-xs mt-2 block">{errors.search.message}</span>}
      </div>

      {/* --- Resultados de la Búsqueda --- */}
      {entrada &&
        procedenciaData.map((i) => (
          <div key={i._id} className="bg-blue-50 p-6 rounded-lg border border-blue-200 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="names" className="block text-sm font-semibold text-gray-600 mb-2">
                  Nombres
                </label>
                <p className="w-full px-4 py-2 bg-gray-200 rounded-lg text-gray-700">{i.nombre}</p>
              </div>
              <div>
                <label htmlFor="lastnames" className="block text-sm font-semibold text-gray-600 mb-2">
                  Apellidos
                </label>
                <p className="w-full px-4 py-2 bg-gray-200 rounded-lg text-gray-700">{i.apellido}</p>
              </div>
              {i.numero_identificacion === 12345 && (
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label htmlFor="entities" className="block text-sm font-semibold text-gray-600 mb-2">
                      Entidad jur&iacute;dica
                    </label>
                    <ModalCreateLegal />
                  </div>

                  <Juzgados setNameCourt={setNameCourt} nameCourt={nameCourt} setJuzgados={setJuzgados} />
                </div>
              )}
            </div>
          </div>
        ))}

      {/* --- Formulario de Registro (si no se encuentra el usuario) --- */}
      {!entrada && (
        <form onSubmit={onSubmit} className="space-y-6 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tipo Documento */}
            <div>
              <label htmlFor="tipo_identificacion" className="block text-sm font-semibold text-gray-600 mb-2">
                Tipo de documento
              </label>
              <select
                id="tipo_identificacion"
                className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('tipo_identificacion', { required: 'Campo requerido' })}
              >
                <option value="">Seleccione...</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PEP">Permiso Especial de Permanencia</option>
                <option value="PPT">Permiso Protección Temporal</option>
                <option value="NIT">NIT</option>
                <option value="OTRO">Otro</option>
              </select>
              {errors.tipo_identificacion && <span className="text-red-500 text-xs mt-2 block">{errors.tipo_identificacion.message}</span>}
            </div>

            {/* Nombres */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-600 mb-2">
                Nombres
              </label>
              <input
                id="nombre"
                type="text"
                className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('nombre', { required: 'El nombre es requerido' })}
              />
              {errors.nombre && <span className="text-red-500 text-xs mt-2 block">{errors.nombre.message}</span>}
            </div>

            {/* Apellidos */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-semibold text-gray-600 mb-2">
                Apellidos
              </label>
              <input
                id="apellido"
                type="text"
                className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('apellido', { required: 'El apellido es requerido' })}
              />
              {errors.apellido && <span className="text-red-500 text-xs mt-2 block">{errors.apellido.message}</span>}
            </div>
          </div>

          {/* --- Información de Contacto --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label htmlFor="tipo_contacto" className="block text-sm font-semibold text-gray-600 mb-2">
                Opción de contacto
              </label>
              <select
                id="tipo_contacto"
                className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('tipo_contacto', { required: 'Seleccione una opción' })}
              >
                <option value="">Seleccione...</option>
                <option value="direccion">Dirección</option>
                <option value="telefono">Teléfono</option>
                <option value="correo">Correo Electrónico</option>
              </select>
              {errors.tipo_contacto && <span className="text-red-500 text-xs mt-2 block">{errors.tipo_contacto.message}</span>}
            </div>

            {/* Input dinámico basado en la selección */}
            <div className="self-end">
              {watch('tipo_contacto') === 'direccion' && (
                <input
                  type="text"
                  placeholder="Dirección"
                  className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('direccion', { required: 'La dirección es requerida' })}
                />
              )}
              {watch('tipo_contacto') === 'telefono' && (
                <input
                  type="number"
                  placeholder="Teléfono"
                  className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('telefono', { required: 'El teléfono es requerido', minLength: 7, maxLength: 10 })}
                />
              )}
              {watch('tipo_contacto') === 'correo' && (
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('correo', { required: 'El correo es requerido', pattern: /^\S+@\S+$/i })}
                />
              )}
            </div>
          </div>

          <div className="flex justify-start pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
            >
              Registrar Usuario
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

Buscador.propTypes = {
  setProcedencia: PropTypes.func.isRequired,
  setJuzgados: PropTypes.func.isRequired,
  setNameCourt: PropTypes.func.isRequired,
  nameCourt: PropTypes.string.isRequired
};

export default Buscador;
