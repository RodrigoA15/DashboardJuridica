import { memo, useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

// Usamos memo para evitar re-renderizados innecesarios si las props no cambian.
const GetEntrada = memo(({ register, errors }) => {
  const [entrada, setEntrada] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const apiGetEntrada = async () => {
      try {
        const response = await axios.get('/channel');
        setEntrada(response.data);
      } catch (error) {
        // En un caso real, podrías notificar al usuario con un toast.
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    apiGetEntrada();
  }, []); // El array vacío asegura que se ejecute solo una vez.

  return (
    <div>
      <label htmlFor="id_canal_entrada" className="block text-sm font-semibold text-gray-600 mb-2">
        Canal de Entrada*
      </label>
      <select
        id="id_canal_entrada"
        className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
        aria-label="Seleccionar canal de entrada"
        disabled={loading}
        {...register('id_canal_entrada', {
          required: 'El canal de entrada es obligatorio'
        })}
      >
        <option value="">{loading ? 'Cargando canales...' : 'Seleccione un canal'}</option>
        {entrada.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_canal}
          </option>
        ))}
      </select>
      {/* Mensaje de error estilizado con Tailwind */}
      {errors.id_canal_entrada && <span className="text-red-500 text-xs mt-2 block">{errors.id_canal_entrada.message}</span>}
    </div>
  );
});

// displayName es útil para depurar con React DevTools
GetEntrada.displayName = 'GetEntrada';

GetEntrada.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default GetEntrada;
