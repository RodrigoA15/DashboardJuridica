import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetEntrada({ setCanalEntrada }) {
  const [entrada, setEntrada] = useState([]);

  useEffect(() => {
    apiGetEntrada();
  }, []);

  const apiGetEntrada = async () => {
    try {
      const response = await axios.get('canal/canal');
      setEntrada(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {console.log(entrada)}
      <select className="form-select  rounded-pill " aria-label="Default select example" onChange={(e) => setCanalEntrada(e.target.value)}>
        <option>Seleccione un canal</option>
        {entrada &&
          entrada.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_canal}
            </option>
          ))}
      </select>
    </div>
  );
}

export default GetEntrada;

GetEntrada.propTypes = {
  setCanalEntrada: PropTypes.func.isRequired
};
