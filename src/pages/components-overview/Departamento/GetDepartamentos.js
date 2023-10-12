import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';

function GetDepartamentos({ register }) {
  const [dataDepartamento, setDataDepartamento] = useState([]);

  useEffect(() => {
    listDepartamentos();
  }, []);

  const listDepartamentos = async () => {
    try {
      const response = await axios.get('/departamentos/departamento');
      setDataDepartamento(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <select
        className="form-select rounded-pill minimal-input-dark"
        {...register('id_departamento', {
          required: {
            value: true
          }
        })}
      >
        <option>Seleccione un departamento</option>
        {dataDepartamento.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_departamento}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GetDepartamentos;

GetDepartamentos.propTypes = {
  register: PropTypes.func.isRequired
};
