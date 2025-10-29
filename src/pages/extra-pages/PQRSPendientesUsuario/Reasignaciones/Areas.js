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
    <div className="mb-2 mt-2">
      {selectEntidad != null && (
        <select
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          onChange={(e) => setSelectArea(e.target.value)}
        >
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
