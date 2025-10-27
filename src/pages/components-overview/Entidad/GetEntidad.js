import axios from 'api/axios';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import GetDepartamentos from '../Departamento/GetDepartamentos';

const GetEntidad = ({ register, errors, watch }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['fetch-entities'],
    queryFn: async () => {
      const response = await axios.get('/entity');
      return response.data;
    },
    staleTime: Infinity,
    placeholderData: [],
    refetchOnWindowFocus: false
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="id_entidad" className="block text-sm font-semibold text-gray-600 mb-2">
          Entidad*
        </label>
        <select
          id="id_entidad"
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
          disabled={isLoading}
          {...register('id_entidad', {
            required: 'La entidad es obligatoria'
          })}
        >
          <option value="">Seleccione una entidad</option>
          {data.map((entidad) => (
            <option key={entidad._id} value={entidad._id}>
              {entidad.nombre_entidad}
            </option>
          ))}
        </select>
        {errors.id_entidad && <span className="text-red-500 text-xs mt-2 block">{errors.id_entidad.message}</span>}
      </div>

      <GetDepartamentos register={register} errors={errors} watch={watch} />
    </div>
  );
};

GetEntidad.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object, // Se mantiene como no requerido según tu código original
  watch: PropTypes.func.isRequired // Añadido para completar los prop-types
};

export default GetEntidad;
