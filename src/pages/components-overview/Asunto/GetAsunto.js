import React, { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import PropTypes from 'prop-types';

function GetAsunto({ register }) {
  const [dataAsunto, setDataAsunto] = useState([]);

  useEffect(() => {
    listaAsuntos();
  }, []);

  const listaAsuntos = async () => {
    try {
      const response = await axios.get('/asunto/asunto');
      setDataAsunto(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select className="form-select rounded-pill minimal-input-dark" {...register('id_asunto')}>
        <option>Seleccione un asunto</option>
        {dataAsunto &&
          dataAsunto.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_asunto}
            </option>
          ))}
      </select>
    </div>
  );
}

export default GetAsunto;

GetAsunto.propTypes = {
  register: PropTypes.func.isRequired
};
