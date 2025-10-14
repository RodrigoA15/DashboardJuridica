import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'api/axios';

function GetAsunto() {
  const [dataAsunto, setDataAsunto] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();

  const id_departamento = watch('id_departamento');

  useEffect(() => {
    const listaAsuntos = async (areaId) => {
      setLoading(true); // Start loading
      setDataAsunto([]); // Clear previous options
      try {
        const response = await axios.get(`/affair/asuntos_departamento/${areaId}`);
        setDataAsunto(response.data);
      } catch (error) {
        console.error('Error al obtener asuntos:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id_departamento) {
      listaAsuntos(id_departamento);
    } else {
      setDataAsunto([]);
    }
  }, [id_departamento]);

  const getPlaceholderOption = () => {
    if (!id_departamento) return 'Seleccione un departamento primero';
    if (loading) return 'Cargando asuntos...';
    if (!loading && dataAsunto.length === 0) return 'No hay asuntos disponibles';
    return 'Seleccione un asunto';
  };

  return (
    <div>
      <label htmlFor="id_asunto" className="block text-sm font-semibold text-gray-600 mb-2">
        Asunto*
      </label>
      <select
        id="id_asunto"
        className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!id_departamento || loading}
        {...register('id_asunto', {
          required: 'El asunto es obligatorio'
        })}
      >
        <option value="">{getPlaceholderOption()}</option>
        {dataAsunto.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_asunto}
          </option>
        ))}
      </select>
      {errors.id_asunto && <span className="text-red-500 text-xs mt-2 block">{errors.id_asunto.message}</span>}
    </div>
  );
}

GetAsunto.displayName = 'GetAsunto';

export default GetAsunto;
