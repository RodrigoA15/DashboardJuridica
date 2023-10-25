import { useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';

function GetEntidad({ register, errors }) {
  const [dataEntidad, setDataEntidad] = useState([]);

  useEffect(() => {
    listEntidad();
  }, []);

  const listEntidad = async () => {
    try {
      const response = await axios.get('/entidad/entidad');
      setDataEntidad(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <select
        className="form-select rounded-pill minimal-input-dark"
        {...register('id_entidad', {
          required: 'Campo entidad es obligatorio'
        })}
      >
        <option value="">Seleccione la entidad</option>
        {dataEntidad.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_entidad}
          </option>
        ))}
      </select>
      {errors.id_entidad && <span className="inputForm">{errors.id_entidad.message}</span>}
    </div>
  );
}

export default GetEntidad;

GetEntidad.propTypes = {
  register: PropTypes.func.isRequired
};
