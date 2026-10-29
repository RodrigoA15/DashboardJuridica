import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import GetAsuntoReasignacion from './Asuntos';
import PropTypes from 'prop-types';

function Areas({ selectArea, setSelectArea, selectEntidad, selectAsunto, setSelectAsunto }) {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (selectEntidad) {
      getAllAreas();
    } else {
      setAreas([]);
      setSelectArea('');
      setSelectAsunto('');
    }
  }, [selectEntidad]);

  const getAllAreas = async () => {
    try {
      const response = await axios.get(`/area/dptoentidad/${selectEntidad}`);
      setAreas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAreas([]);
      }
    }
  };

  return (
    <div className="mb-2 mt-2">
      {selectEntidad != null && (
        <select
          className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow mb-3"
          value={selectArea || ''} // <- Esto faltaba para controlar el select y permitir la selección
          onChange={(e) => {
            setSelectArea(e.target.value);
            setSelectAsunto(''); // Resetea el asunto al cambiar de área
          }}
        >
          <option value="">Seleccione área</option>
          {areas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.nombre_departamento}
            </option>
          ))}
        </select>
      )}

      <GetAsuntoReasignacion id_area={selectArea} value={selectAsunto} onChange={(e) => setSelectAsunto(e.target.value)} />
    </div>
  );
}

export default Areas;

Areas.propTypes = {
  selectArea: PropTypes.string,
  setSelectArea: PropTypes.func,
  selectEntidad: PropTypes.string,
  selectAsunto: PropTypes.string,
  setSelectAsunto: PropTypes.func
};
