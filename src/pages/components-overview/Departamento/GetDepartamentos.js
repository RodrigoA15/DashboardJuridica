import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import axios from 'api/axios';
import GetAsunto from '../Asunto/GetAsunto';

function GetDepartamentos() {
  const {
    watch,
    register,
    formState: { errors }
  } = useFormContext();
  const id_entidad = watch('id_entidad');
  const { data = [], isLoading } = useQuery({
    queryKey: ['fetch-areas-entity', id_entidad],
    queryFn: async () => {
      const response = await axios.get(`/area/dptoentidad/${id_entidad}`);
      return response.data;
    },
    enabled: !!id_entidad,
    staleTime: Infinity,
    placeholderData: [],
    refetchOnWindowFocus: false
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="id_departamento" className="block text-sm font-semibold text-gray-600 mb-2">
          &Aacute;rea*
        </label>
        <select
          id="id_departamento"
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!id_entidad || isLoading}
          {...register('id_departamento', {
            required: 'El departamento es obligatorio'
          })}
        >
          <option value="">Seleccione &aacute;rea</option>
          {data.map((i) => (
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
