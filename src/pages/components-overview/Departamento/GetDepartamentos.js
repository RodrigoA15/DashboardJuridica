import { useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import GetAsunto from '../Asunto/GetAsunto';

function GetDepartamentos({ register, setIdDepartamento, id_departamento, errors, selectedEntityId }) {
  const [dataDepartamento, setDataDepartamento] = useState([]);

  useEffect(() => {
    if (selectedEntityId) {
      listDepartamentos(selectedEntityId);
    }
  }, [selectedEntityId]);

  const listDepartamentos = async (entityId) => {
    try {
      const response = await axios.get(`/departamentos/dptoentidad/${entityId}`);
      setDataDepartamento(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select className="form-select rounded-pill minimal-input-dark" onChange={(e) => setIdDepartamento(e.target.value)}>
        <option>Seleccione un departamento</option>
        {dataDepartamento.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_departamento}
          </option>
        ))}
      </select>
      <GetAsunto register={register} errors={errors} id_departamento={id_departamento} />
    </div>
  );
}

GetDepartamentos.propTypes = {
  register: PropTypes.func.isRequired
};

export default GetDepartamentos;
