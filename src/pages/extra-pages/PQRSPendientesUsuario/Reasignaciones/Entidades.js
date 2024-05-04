import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import Areas from './Areas';
import PropTypes from 'prop-types';

function Entidades({ selectArea, setSelectArea, setSelectEntidad, selectEntidad }) {
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    getAllEntidades();
  }, []);

  const getAllEntidades = async () => {
    try {
      const response = await axios.get('/entity');
      setEntidades(response.data);
    } catch (error) {
      console.log('No se encontrarón entidades');
    }
  };

  return (
    <div>
      <select className="form-select" onChange={(e) => setSelectEntidad(e.target.value)}>
        <option value="">Seleccione entidad</option>
        {entidades.map((entidad) => (
          <option key={entidad._id} value={entidad._id}>
            {entidad.nombre_entidad}
          </option>
        ))}
      </select>
      <Areas selectArea={selectArea} setSelectArea={setSelectArea} selectEntidad={selectEntidad} />
    </div>
  );
}

export default Entidades;

Entidades.propTypes = {
  setError: PropTypes.func,
  selectArea: PropTypes.string,
  setSelectArea: PropTypes.func,
  setSelectEntidad: PropTypes.func,
  selectEntidad: PropTypes.string
};
