import { useQuery } from '@tanstack/react-query';
import axios from 'api/axios';
import PropTypes from 'prop-types';

function GetAsuntoReasignacion({ id_area, value, onChange }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['fetch-asuntos-area', id_area],
    queryFn: async () => {
      const response = await axios.get(`/affair/asuntos_departamento/${id_area}`);
      return response.data;
    },
    staleTime: Infinity,
    enabled: !!id_area,
    placeholderData: []
  });

  const getPlaceholderOption = () => {
    if (!id_area) return 'Seleccione un departamento primero';
    if (isLoading) return 'Cargando asuntos...';
    if (!isLoading && data.length === 0) return 'No hay asuntos disponibles';
    return 'Seleccione un asunto';
  };

  return (
    <div>
      <label htmlFor="id_asunto" className="block text-sm font-semibold text-gray-600 mb-2">
        Asunto*
      </label>
      <select
        id="id_asunto"
        value={value || ''}
        onChange={onChange}
        className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!id_area || isLoading}
      >
        <option value="">{getPlaceholderOption()}</option>
        {data.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_asunto}
          </option>
        ))}
      </select>
    </div>
  );
}

GetAsuntoReasignacion.displayName = 'GetAsuntoReasignacion';

export default GetAsuntoReasignacion;

GetAsuntoReasignacion.propTypes = {
  id_area: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};
