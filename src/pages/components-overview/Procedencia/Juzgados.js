import React, { useState } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, OutlinedInput } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

function Juzgados({ setNameCourt, nameCourt }) {
  const {
    register,
    formState: { errors }
  } = useForm();
  const [courtsData, setCourtsData] = useState([]);
  const [registerCourt, setRegisterCourt] = useState(false);
  const [found, setFound] = useState(false);
  const [validation, setValidation] = useState('');

  const dataApiCourts = async () => {
    try {
      const data = await axios.get(`/oneCourt/${nameCourt}`);
      setCourtsData(data.data);
      setFound(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontro la entidad');
      } else {
        toast.error('error de servidor');
        console.log(error);
      }
    }
  };

  const dataApiCourtsMongo = async () => {
    try {
      const response = await axios.get(`/listEntitiesbyid/${courtsData[0].RUNT_ENTE}`);
      const message = response.data.message;
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

  const registerCourtMongo = async (court) => {
    try {
      await axios.post('/createEntity', {
        desc_ente_juridico: court.DESC_ENTE_JURIDICO,
        runt_ente: court.RUNT_ENTE,
        municipio: court.MUNICIPIO
      });
      toast.success('Registrado correctamente');
    } catch (error) {
      toast.error('No se pudo registrar');
    }
  };

  return (
    <div>
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
            onChange={(e) => setNameCourt(e.target.value)}
            required
          />
          {errors.search && <span className="inputForm ">{errors.search.message}</span>}
          <Button onClick={dataApiCourts}>Buscar</Button>
        </div>
      </div>
      <div>
        {found && (
          <div>
            {courtsData.map((court) => (
              <div className="row mt-3">
                <div className="col" key={court.RUNT_ENTE}>
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
                    <input type="text" className="form-control rounded-pill minimal-input-dark" value={court.RUNT_ENTE} readOnly />
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
    </div>
  );
}

export default Juzgados;

Juzgados.proTypes = {
  setNameCourt: PropTypes.object.isRequired,
  nameCourt: PropTypes.object.isRequired
};
