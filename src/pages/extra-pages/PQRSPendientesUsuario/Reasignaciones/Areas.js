import React, { useEffect, useState } from 'react';
import axios from 'api/axios';

function Areas({ setSelectArea, selectEntidad }) {
  //Todo estado api
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    getAllAreas();
  }, [selectEntidad]);

  const getAllAreas = async () => {
    try {
      const response = await axios.get(`/area/dptoentidad/${selectEntidad}`);
      setAreas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No se encontraron áreas');
      }
    }
  };

  return (
    <div>
      {selectEntidad != null && (
        <select className="form-select" onChange={(e) => setSelectArea(e.target.value)}>
          <option value="">Seleccione área</option>
          {areas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.nombre_departamento}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default Areas;
