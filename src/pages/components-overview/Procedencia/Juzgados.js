import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useAuth } from 'context/authContext';
import Cities from './cities';
import AsyncSelect from 'react-select/async';

function Juzgados({ setNameCourt, nameCourt, setJuzgados }) {
  const [validation, setValidation] = useState('');
  //Crear entes juridcos manuales
  const [data, setData] = React.useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [registerEntity, setRegisterEntity] = useState(false);
  const Myswal = withReactContent(Swal);
  const { user } = useAuth();

  useEffect(() => {
    apiDataEntidad();
    setDescripcion(nameCourt);
  }, [nameCourt]);

  const apiDataEntidad = async () => {
    try {
      const response = await axios.get('/listEntities');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dataApiCourtsMongo = async () => {
    try {
      const trimmedMunicipio = municipio.label.trim();
      const trimmedDescripcion = nameCourt.label.trim();
      const response = await axios.get(`/listEntitiesbyid/${trimmedDescripcion}/${trimmedMunicipio}`);
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
        text: '¿Está seguro de crear la entidad jurídica?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
      });

      if (alert.isConfirmed) {
        // Elimina espacios en blanco al principio y al final de las cadenas
        const trimmedDescripcion = descripcion.trim();
        const trimmedMunicipio = municipio.label.trim();

        await axios.post('/createEntity', {
          desc_ente_juridico: trimmedDescripcion,
          municipio: trimmedMunicipio
        });

        await Myswal.fire({
          text: 'Entidad creada correctamente',
          icon: 'success'
        });

        dataApiCourtsMongo();
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
      const datos = `El usuario ${user.username} creo la entidad juridica: ${descripcion} del municipio de ${municipio.label}`;
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

  const filterColors = (inputValue) => {
    return data
      .filter((i) => i.desc_ente_juridico.toLowerCase().includes(inputValue.toLowerCase()))
      .map((i) => ({
        label: i.desc_ente_juridico,
        value: i._id
      }));
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterColors(inputValue));
    }, 1000);
  };

  return (
    <div>
      <div className="row mt-3">
        <div className="col">
          <label className="form-label h6" htmlFor="desc_entidad">
            Nombre Entidad
          </label>
          <AsyncSelect
            className="basic-single"
            classNamePrefix="select"
            cacheOptions
            loadOptions={loadOptions}
            onChange={setNameCourt}
            isClearable={true}
          />
        </div>
        <div className="col">
          <label className="form-label h6" htmlFor="municipio">
            Municipio
          </label>
          <Cities setMunicipio={setMunicipio} municipio={municipio} />
        </div>
        <span className="errors">{validation}</span>
        {!municipio.label ? <span className="errors">Municipio es requerido</span> : <Button onClick={dataApiCourtsMongo}>Buscar</Button>}
      </div>
      {registerEntity && (
        <div className="d-flex flex-column align-items-center">
          <input className="form-control mb-3" value={nameCourt.label} readOnly />
          <input className="form-control mb-3" value={municipio.label} readOnly />
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
