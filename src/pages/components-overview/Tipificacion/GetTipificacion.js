import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetTipificacion({ setTipificacion }) {
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
      <select className="form-select rounded-pill" onChange={(e) => setTipificacion(e.target.value)}>
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
  setTipificacion: PropTypes.func.isRequired
};
