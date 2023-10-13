import { useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import GetAsunto from '../Asunto/GetAsunto';

function GetDepartamentos({ register, setIdDepartamento, id_departamento }) {
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

  const siu = (event) => {
    setIdDepartamento(event.target.value);
  };

  return (
    <div>
      <select className="form-select rounded-pill minimal-input-dark" onChange={siu}>
        <option>Seleccione un departamento</option>
        {dataDepartamento.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_departamento}
          </option>
        ))}
      </select>
      <GetAsunto register={register} id_departamento={id_departamento} />
      {id_departamento}
    </div>
  );
}

export default GetDepartamentos;

GetDepartamentos.propTypes = {
  register: PropTypes.func.isRequired
};
