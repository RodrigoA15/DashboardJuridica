import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetEntrada({ register, errors }) {
  const [entrada, setEntrada] = useState([]);

  useEffect(() => {
    apiGetEntrada();
  }, []);

  const apiGetEntrada = async () => {
    try {
      const response = await axios.get('canal/canal');
      setEntrada(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <select
        className="form-select rounded-pill minimal-input-dark"
        aria-label="Default select example"
        {...register('id_canal_entrada', {
          required: 'Canal entrada es obligatorio'
        })}
      >
        <option value="">Seleccione un canal</option>
        {entrada &&
          entrada.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_canal}
            </option>
          ))}
      </select>
      {errors.id_canal_entrada && <span className="inputForm">{errors.id_canal_entrada.message}</span>}
    </div>
  );
}

export default GetEntrada;

GetEntrada.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};
