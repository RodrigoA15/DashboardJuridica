import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useAuth } from 'context/authContext';

function Juzgados({ setNameCourt, nameCourt, setJuzgados }) {
  const [validation, setValidation] = useState('');
  //Crear entes juridcos manuales
  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [registerEntity, setRegisterEntity] = useState(false);
  const Myswal = withReactContent(Swal);
  const { user } = useAuth();

  useEffect(() => {
    setDescripcion(nameCourt);
  }, [nameCourt]);

  const dataApiCourtsMongo = async () => {
    try {
      const response = await axios.get(`/listEntitiesbyid/${descripcion}/${municipio}`);
      const id_juzgado = response.data.response._id;
      setJuzgados(id_juzgado);
      setRegisterEntity(false);
      const message = response.data.message;
      setValidation(message);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const message = error.response.data.message;
        setValidation(message);
        setRegisterEntity(true);
      }
    }
  };

  const registerEntityApi = async () => {
    try {
      const alert = await Myswal.fire({
        text: '¿Está seguro de crear la entidad juridica?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
      });
      if (alert.isConfirmed) {
        await axios.post('/createEntity', {
          desc_ente_juridico: descripcion,
          municipio: municipio
        });
        await Myswal.fire({
          text: 'Entidad creada correctamente',
          icon: 'success'
        });
      } else {
        await Myswal.fire({
          text: 'Cancelado',
          icon: 'warning'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const historialCambios = async () => {
    try {
      const datos = `El usuario ${user.username} creo la entidad juridica: ${descripcion} del municipio de ${municipio}`;
      await axios.post('/historial', {
        observacion: datos
      });
    } catch (error) {
      Myswal.fire({
        text: 'Ops error de servidor  :(',
        icon: 'error',
        customClass: {
          container: 'swal-zindex'
        }
      });
    }
  };

  const handleOnClick = () => {
    historialCambios();
    registerEntityApi();
  };

  return (
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
            required
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
        {!municipio ? <span className="errors">Municipio es requerido</span> : <Button onClick={dataApiCourtsMongo}>Buscar</Button>}
      </div>
      {registerEntity && (
        <div className="d-flex flex-column align-items-center">
          <input className="form-control mb-3" value={descripcion} readOnly />
          <input className="form-control mb-3" value={municipio} readOnly />
          <button className="btn btn-success" onClick={handleOnClick}>
            Registrar
          </button>
        </div>
      )}
    </div>
  );
}

export default Juzgados;

Juzgados.propTypes = {
  setNameCourt: PropTypes.func.isRequired,
  setJuzgados: PropTypes.func.isRequired,
  nameCourt: PropTypes.string.isRequired
};
