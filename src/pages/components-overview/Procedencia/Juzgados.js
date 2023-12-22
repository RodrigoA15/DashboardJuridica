import React, { useEffect, useState } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, OutlinedInput } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

function Juzgados({ setNameCourt, nameCourt, setJuzgados }) {
  const {
    register,
    formState: { errors }
  } = useForm();
  const [courtsData, setCourtsData] = useState([]);
  const [registerCourt, setRegisterCourt] = useState(false);
  const [found, setFound] = useState(false);
  const [validation, setValidation] = useState('');
  //Crear entes juridcos manuales
  const [foundQX, setFoundQX] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');

  useEffect(() => {
    setDescripcion(nameCourt);
  }, [nameCourt]);

  //Consumo de api BDD QX
  const dataApiCourts = async () => {
    try {
      const data = await axios.get(`/oneCourt/${nameCourt}`);
      setCourtsData(data.data);
      setFound(true);
      setFoundQX(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontro la entidad');
        setFound(false);
      } else {
        toast.error('error de servidor');
        console.log(error);
      }
    }
  };

  const dataApiCourtsMongo = async () => {
    try {
      const response = await axios.get(`/listEntitiesbyid/${courtsData[0].DESC_ENTE_JURIDICO}/${courtsData[0].MUNICIPIO}`);
      const message = response.data.message;
      const id_juzgado = response.data.response._id;
      setJuzgados(id_juzgado);
      setValidation(message);
      setRegisterCourt(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const message = error.response.data.message;
        setValidation(message);
        setRegisterCourt(true);
      }
    }
  };

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
        setRegisterCourt(true);
        setFoundQX(true);
      }
    }
  };

  const registerCourtMongo = async (court) => {
    try {
      await axios.post('/createEntity', {
        desc_ente_juridico: court.DESC_ENTE_JURIDICO,
        municipio: court.MUNICIPIO
      });
      toast.success('Registrado correctamente');
    } catch (error) {
      toast.error('No se pudo registrar');
    }
  };

  const registerCourtMongoQX = async () => {
    try {
      await axios.post('/createEntity', {
        desc_ente_juridico: descripcion,
        municipio: municipio
      });
      toast.success('Registrado correctamente');
    } catch (error) {
      toast.error('No se pudo registrar');
      console.log(error);
    }
  };

  return (
    <div>
      {/* Buscador base de datos QX */}
      <div className="row">
        <Toaster position="top-right" richColors />
        <div className="col">
          <OutlinedInput
            {...register('search', {
              required: 'El termino busqueda no puede estar vacio'
            })}
            size="small"
            id="search2"
            sx={{
              width: '430px'
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            }
            placeholder="Digite nombre de  la  Entidad Juridica"
            onChange={(e) => setNameCourt(e.target.value.toUpperCase())}
            required
          />
          {errors.search && <span className="inputForm ">{errors.search.message}</span>}
          <Button onClick={dataApiCourts}>Buscar</Button>
        </div>
      </div>
      <div>
        {/* Si la entidad esta registrada en QX se pasan los valores para registrarla en Mongo */}
        {found && (
          <div>
            {courtsData.map((court) => (
              <div className="row mt-3" key={court.ID_ENTE_JURIDICO}>
                <div className="col">
                  <input
                    type="text"
                    className="form-control rounded-pill minimal-input-dark"
                    id="nombre"
                    value={court.DESC_ENTE_JURIDICO}
                    readOnly
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control rounded-pill minimal-input-dark"
                    id="nombre"
                    value={court.MUNICIPIO}
                    readOnly
                  />
                </div>

                <span className="errors">{validation}</span>
                <Button onClick={dataApiCourtsMongo}>Buscar</Button>

                {registerCourt && (
                  <>
                    <input type="text" className="form-control rounded-pill minimal-input-dark" value={court.DESC_ENTE_JURIDICO} readOnly />
                    <input type="text" className="form-control rounded-pill minimal-input-dark" value={court.MUNICIPIO} readOnly />

                    <Button onClick={() => registerCourtMongo(court)}>Registrar</Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {/* Si la entidad juridica no se encuentra en QX se hace la busqueda manual en Mongo */}
        {!found && (
          <div className="row mt-3">
            <div className="col">
              <label className="form-label h6" htmlFor="desc_entidad">
                Nombre Entidad
              </label>
              <input
                type="text"
                className="form-control rounded-pill minimal-input-dark"
                id="nombre"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
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
        )}
      </div>
      <div>
        {/* Registrar la entidad juridica en Mongo */}
        {foundQX && (
          <div className="row mt-3">
            <div className="col">
              <input
                type="text"
                className="form-control rounded-pill minimal-input-dark"
                value={descripcion}
                required
                onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control rounded-pill minimal-input-dark"
                id="municipio"
                onChange={(e) => setMunicipio(e.target.value.toUpperCase())}
              />
            </div>
            {!municipio ? (
              <p className="errors">Campo es requerido</p>
            ) : (
              <Button color="success" onClick={() => registerCourtMongoQX()}>
                Registrar
              </Button>
            )}
          </div>
        )}
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
