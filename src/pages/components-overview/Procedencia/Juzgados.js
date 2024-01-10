import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

function Juzgados({ setNameCourt, nameCourt, setJuzgados }) {
  const [validation, setValidation] = useState('');
  //Crear entes juridcos manuales
  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');

  useEffect(() => {
    setDescripcion(nameCourt);
  }, [nameCourt]);

  const dataApiCourtsMongoII = async () => {
    try {
      const response = await axios.get(`/listEntitiesbyid/${descripcion}/${municipio}`);
      const id_juzgado = response.data.response._id;
      setJuzgados(id_juzgado);
      const message = response.data.message;
      setValidation(message);
      setRegisterCourt(false);
      setFoundQX(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const message = error.response.data.message;
        setValidation(message);
      }
    }
  };

  return (
    <div>
      <div>
        <div className="row mt-3">
          <div className="col">
            <label className="form-label h6" htmlFor="desc_entidad">
              Nombre Entidad
            </label>
            <input
              type="text"
              className="form-control rounded-pill minimal-input-dark"
              id="nombre"
              onChange={(e) => setNameCourt(e.target.value.toUpperCase())}
            />
          </div>
          <div className="col">
            <label className="form-label h6" htmlFor="municipio">
              Municipio
            </label>
            <input
              type="text"
              className="form-control rounded-pill minimal-input-dark"
              id="nombre"
              onChange={(e) => setMunicipio(e.target.value.toUpperCase())}
              required
            />
          </div>
          <span className="errors">{validation}</span>
          {!municipio ? <span className="errors">Municipio es requerido</span> : <Button onClick={dataApiCourtsMongoII}>Buscar</Button>}
        </div>
      </div>
    </div>
  );
}

export default Juzgados;

Juzgados.propTypes = {
  setNameCourt: PropTypes.func.isRequired,
  setJuzgados: PropTypes.func.isRequired,
  nameCourt: PropTypes.string.isRequired
};
