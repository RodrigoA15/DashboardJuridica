import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetAsunto({ register, id_departamento, errors }) {
  const [dataAsunto, setDataAsunto] = useState([]);

  useEffect(() => {
    if (id_departamento) {
      listaAsuntos();
    }
  }, [id_departamento]);

  const listaAsuntos = async () => {
    try {
      const response = await axios.get(`asunto/asuntos_departamento/${id_departamento}`);
      setDataAsunto(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select
        className="form-select rounded-pill minimal-input-dark mt-3"
        {...register('id_asunto', { required: 'Campo asunto es obligatorio' })}
      >
        <option value="">Seleccione un asunto</option>
        {dataAsunto && dataAsunto.length > 0 ? (
          dataAsunto.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_asunto}
            </option>
          ))
        ) : (
          <option disabled>No asuntos</option>
        )}
      </select>
      {errors.id_asunto && <span className="inputForm">{errors.id_asunto.message}</span>}
    </div>
  );
}

export default GetAsunto;

GetAsunto.propTypes = {
  register: PropTypes.func
};
