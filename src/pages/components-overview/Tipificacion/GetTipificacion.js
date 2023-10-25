import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetTipificacion({ register, errors }) {
  const [dataTipicacion, setDataTipificacion] = useState([]);

  useEffect(() => {
    listTipificacion();
  }, []);

  const listTipificacion = async () => {
    try {
      const response = await axios.get('/tipificacion/tipificacion');
      setDataTipificacion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select
        className="form-select rounded-pill minimal-input-dark"
        {...register('id_tipificacion', {
          required: 'Tipificacion es obligatorio'
        })}
      >
        <option value="">Seleccione Tipificacion</option>
        {dataTipicacion &&
          dataTipicacion.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_tipificacion}
            </option>
          ))}
      </select>
      {errors.id_tipificacion && <span className="inputForm">{errors.id_tipificacion.message}</span>}
    </div>
  );
}

export default GetTipificacion;

GetTipificacion.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};
