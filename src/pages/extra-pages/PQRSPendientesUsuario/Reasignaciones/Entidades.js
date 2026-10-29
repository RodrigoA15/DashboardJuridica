import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import Areas from './Areas';
import PropTypes from 'prop-types';

function Entidades({ selectArea, setSelectArea, setSelectEntidad, selectEntidad, selectAsunto, setSelectAsunto }) {
  const [entidades, setEntidades] = useState([]);

  useEffect(() => {
    getAllEntidades();
  }, []);

  const getAllEntidades = async () => {
    try {
      const response = await axios.get('/entity');
      setEntidades(response.data);
    } catch (error) {
      console.log('No se encontraron entidades');
    }
  };

  return (
    <div className="mb-2">
      <select
        className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow mb-3"
        value={selectEntidad || ''}
        onChange={(e) => {
          setSelectEntidad(e.target.value);
          setSelectArea(''); // Limpiar área al cambiar entidad
          setSelectAsunto(''); // Limpiar asunto al cambiar entidad
        }}
      >
        <option value="">Seleccione entidad</option>
        {entidades.map((entidad) => (
          <option key={entidad._id} value={entidad._id}>
            {entidad.nombre_entidad}
          </option>
        ))}
      </select>

      <Areas
        selectArea={selectArea}
        setSelectArea={setSelectArea}
        selectEntidad={selectEntidad}
        selectAsunto={selectAsunto}
        setSelectAsunto={setSelectAsunto}
      />
    </div>
  );
}

export default Entidades;

Entidades.propTypes = {
  setError: PropTypes.func,
  selectArea: PropTypes.string,
  setSelectArea: PropTypes.func,
  setSelectEntidad: PropTypes.func,
  selectEntidad: PropTypes.string,
  selectAsunto: PropTypes.string,
  setSelectAsunto: PropTypes.func
};
