import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'api/axios';
import GetAsunto from '../Asunto/GetAsunto';

function GetDepartamentos() {
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    watch,
    register,
    formState: { errors }
  } = useFormContext();

  const id_entidad = watch('id_entidad');

  useEffect(() => {
    const listDepartamentos = async (entityId) => {
      setLoading(true);
      setDataDepartamento([]);
      try {
        const response = await axios.get(`/area/dptoentidad/${entityId}`);
        setDataDepartamento(response.data);
      } catch (error) {
        console.error('Error al obtener departamentos:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id_entidad) {
      listDepartamentos(id_entidad);
    } else {
      setDataDepartamento([]);
    }
  }, [id_entidad]);

  const getPlaceholderOption = () => {
    if (!id_entidad) return 'Seleccione una entidad primero';
    if (loading) return 'Cargando departamentos...';
    return 'Seleccione un departamento';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="id_departamento" className="block text-sm font-semibold text-gray-600 mb-2">
          Departamento*
        </label>
        <select
          id="id_departamento"
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!id_entidad || loading}
          {...register('id_departamento', {
            required: 'El departamento es obligatorio'
          })}
        >
          <option value="">{getPlaceholderOption()}</option>
          {dataDepartamento.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_departamento}
            </option>
          ))}
        </select>
        {errors.id_departamento && <span className="text-red-500 text-xs mt-2 block">{errors.id_departamento.message}</span>}
      </div>

      <div>
        <GetAsunto />
      </div>
    </div>
  );
}

GetDepartamentos.displayName = 'GetDepartamentos';

export default GetDepartamentos;
