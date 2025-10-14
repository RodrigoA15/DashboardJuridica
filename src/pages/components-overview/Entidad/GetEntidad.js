import { memo, useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import GetDepartamentos from '../Departamento/GetDepartamentos';

const GetEntidad = memo(({ register, errors, watch }) => {
  const [dataEntidad, setDataEntidad] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para la carga

  useEffect(() => {
    const listEntidad = async () => {
      try {
        const response = await axios.get('/entity');
        setDataEntidad(response.data);
      } catch (error) {
        console.error('Error al obtener las entidades:', error);
        // Aquí podrías mostrar una notificación de error al usuario
      } finally {
        setLoading(false); // Termina la carga, sea exitosa o no
      }
    };

    listEntidad();
  }, []);

  return (
    // Se utiliza space-y-6 para dar un espaciado consistente a los elementos hijos
    <div className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="id_entidad" className="block text-sm font-semibold text-gray-600 mb-2">
          Entidad*
        </label>
        <select
          id="id_entidad"
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
          disabled={loading}
          {...register('id_entidad', {
            required: 'La entidad es obligatoria'
          })}
        >
          <option value="">{loading ? 'Cargando entidades...' : 'Seleccione una entidad'}</option>
          {dataEntidad.map((entidad) => (
            <option key={entidad._id} value={entidad._id}>
              {entidad.nombre_entidad}
            </option>
          ))}
        </select>
        {errors.id_entidad && <span className="text-red-500 text-xs mt-2 block">{errors.id_entidad.message}</span>}
      </div>

      {/* El componente hijo se renderiza aquí, heredando el espaciado del div padre */}
      <GetDepartamentos register={register} errors={errors} watch={watch} />
    </div>
  );
});

GetEntidad.displayName = 'GetEntidad';

GetEntidad.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object, // Se mantiene como no requerido según tu código original
  watch: PropTypes.func.isRequired // Añadido para completar los prop-types
};

export default GetEntidad;
