import React from 'react'; // Importar React
import axios from '../../../api/axios';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

// Envolvemos el componente con React.memo
const GetEntrada = React.memo(({ register, errors }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['fetch-canal-entrada'],
    queryFn: async () => {
      const response = await axios.get('/channel');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hora
    // --------------------
    placeholderData: [],
    refetchOnWindowFocus: false
  });

  return (
    <div>
      <label htmlFor="id_canal_entrada" className="block text-sm font-semibold text-gray-600 mb-2">
        Canal de Entrada*
      </label>
      <select
        id="id_canal_entrada"
        className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
        aria-label="Seleccionar canal de entrada"
        disabled={isLoading}
        {...register('id_canal_entrada', {
          required: 'El canal de entrada es obligatorio'
        })}
      >
        <option value="">{isLoading ? 'Cargando canales...' : 'Seleccione un canal'}</option>
        {data.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_canal}
          </option>
        ))}
      </select>
      {errors.id_canal_entrada && <span className="text-red-500 text-xs mt-2 block">{errors.id_canal_entrada.message}</span>}
    </div>
  );
}); // Fin de React.memo

GetEntrada.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

// Asignar el displayName después del memo
GetEntrada.displayName = 'GetEntrada';

export default GetEntrada;
