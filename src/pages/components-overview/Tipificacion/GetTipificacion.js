import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetTipificacion({ register }) {
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
          required: {
            value: true
          }
        })}
      >
        <option>Seleccione Tipificacion</option>
        {dataTipicacion.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_tipificacion}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GetTipificacion;

GetTipificacion.propTypes = {
  register: PropTypes.func.isRequired
};
