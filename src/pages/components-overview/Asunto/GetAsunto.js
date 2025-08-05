import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'api/axios';

function GetAsunto() {
  const [dataAsunto, setDataAsunto] = useState([]);
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();
  const id_departamento = watch('id_departamento');

  useEffect(() => {
    if (id_departamento) {
      listaAsuntos(id_departamento);
    } else {
      setDataAsunto([]);
    }
  }, [id_departamento]);

  const listaAsuntos = async (areaId) => {
    try {
      const response = await axios.get(`/affair/asuntos_departamento/${areaId}`);
      setDataAsunto(response.data);
    } catch (error) {
      console.error('Error al obtener asuntos:', error);
    }
  };

  return (
    <div>
      <label htmlFor="id_asunto" className="form-label">
        Asunto
      </label>
      <select
        className="form-select rounded-pill minimal-input-dark"
        {...register('id_asunto', {
          required: 'Campo asunto es obligatorio'
        })}
      >
        <option value="">Seleccione un asunto</option>
        {dataAsunto.length > 0 ? (
          dataAsunto.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_asunto}
            </option>
          ))
        ) : (
          <option disabled>No hay asuntos</option>
        )}
      </select>
      {errors?.id_asunto && <span className="inputForm">{errors.id_asunto.message}</span>}
    </div>
  );
}

export default GetAsunto;
