import React, { useState } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, OutlinedInput } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { Button } from '@mui/material';

function Juzgados() {
  const [courtsData, setCourtsData] = useState([]);
  const [nameCourt, setNameCourt] = useState('');
  const [found, setFound] = useState(false);

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
  const {
    register,
    formState: { errors }
  } = useForm();
  return (
    <div className="row">
      <Toaster position="top-right" richColors />
      <div className="col-2">
        <h5>Informaci&oacute;n entidad jur&iacute;dica</h5>
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

      <div>
        {found && (
          <div>
            {courtsData.map((court) => (
              <div key={court.RUNT_ENTE}>
                <input
                  type="text"
                  className="form-control rounded-pill minimal-input-dark"
                  id="nombre"
                  value={court.DESC_ENTE_JURIDICO}
                  readOnly
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Juzgados;
