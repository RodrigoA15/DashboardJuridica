import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import UsuariosQX from './UsuariosQX';

function Areas({ setError, setSelectArea, selectArea }) {
  //Todo estado api
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    getAllAreas();
  }, []);

  const getAllAreas = async () => {
    try {
      const response = await axios.get('/departamentos/departamento');
      setAreas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No se encontraron áreas');
      }
    }
  };
  return (
    <div>
      <select className="form-select" onChange={(e) => setSelectArea(e.target.value)}>
        <option value="">Seleccione área</option>
        {areas.map((area) => (
          <option key={area._id} value={area._id}>
            {area.nombre_departamento}
          </option>
        ))}
      </select>
      <UsuariosQX setError={setError} selectArea={selectArea} />
    </div>
  );
}

export default Areas;
