import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'api/axios';
import GetAsunto from '../Asunto/GetAsunto';

function GetDepartamentos() {
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();

  const id_entidad = watch('id_entidad');

  useEffect(() => {
    if (id_entidad) {
      listDepartamentos(id_entidad);
    } else {
      setDataDepartamento([]);
    }
  }, [id_entidad]);

  const listDepartamentos = async (entityId) => {
    try {
      const response = await axios.get(`/area/dptoentidad/${entityId}`);
      setDataDepartamento(response.data);
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
    }
  };

  return (
    <div className="row">
      <div className="col-6">
        <label htmlFor="id_departamento" className="form-label">
          Departamento
        </label>
        <select
          className="form-select rounded-pill minimal-input-dark"
          {...register('id_departamento', {
            required: 'Campo área es obligatorio'
          })}
        >
          <option value="">Seleccione un departamento</option>
          {dataDepartamento.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_departamento}
            </option>
          ))}
        </select>
        {errors?.id_departamento && <span className="inputForm">{errors.id_departamento.message}</span>}
      </div>

      <div className="col-6">
        <GetAsunto />
      </div>
    </div>
  );
}

export default GetDepartamentos;
