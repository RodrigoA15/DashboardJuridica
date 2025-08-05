import { memo, useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import GetDepartamentos from '../Departamento/GetDepartamentos';

const GetEntidad = memo(({ register, errors, watch }) => {
  const [dataEntidad, setDataEntidad] = useState([]);

  useEffect(() => {
    listEntidad();
  }, []);

  const listEntidad = async () => {
    try {
      const response = await axios.get('/entity');
      const data = response.data;
      setDataEntidad(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <select
          className="form-select rounded-pill minimal-input-dark"
          {...register('id_entidad', {
            required: 'Campo entidad es obligatorio'
          })}
        >
          <option value="">Seleccione entidad</option>
          {dataEntidad.map((entidad) => (
            <option key={entidad._id} value={entidad._id}>
              {entidad.nombre_entidad}
            </option>
          ))}
        </select>
        {errors.id_entidad && <span className="inputForm">{errors.id_entidad.message}</span>}
      </div>

      <GetDepartamentos register={register} errors={errors} watch={watch} />
    </div>
  );
});

GetEntidad.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default GetEntidad;
