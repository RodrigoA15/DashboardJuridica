import React, { useEffect, useState } from 'react';
import axios from 'api/axios';

function Entidades({ setError }) {
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    getAllEntidades();
  }, []);

  const getAllEntidades = async () => {
    try {
      const response = await axios.get('/entidad/entidad');
      setEntidades(response.data);
    } catch (error) {
      setError('No se encontrarón entidades');
    }
  };
  return (
    <div>
      <select className="form-select">
        <option value="">Seleccione entidad</option>
        {entidades.map((entidad) => (
          <option key={entidad._id} value={entidad._id}>
            {entidad.nombre_entidad}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Entidades;
