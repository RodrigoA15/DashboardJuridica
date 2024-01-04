import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'api/axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from 'prop-types';

function CrearArea({ toast }) {
  const [nombreArea, setNombreArea] = useState('');
  const [idEntidad, setIdEntidad] = useState('');
  const [entidad, setEntidad] = useState([]);
  const [crear, setCrear] = useState(false);
  const [error, setError] = useState('');
  //TODO Alerta
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    dataApiEntidad();
  }, []);

  const dataApiEntidad = async () => {
    try {
      const response = await axios.get('/entidad/entidad');
      setEntidad(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postApiArea = async () => {
    try {
      if (!nombreArea) {
        return setError('Nombre área es obligatorio');
      } else if (!idEntidad) {
        return setError('Entidad es obligatorio');
      }

      const alert = await MySwal.fire({
        title: '¿Está seguro de crear el área?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, crear'
      });

      if (alert.isConfirmed) {
        await axios.post('departamentos/departamento', {
          id_entidad: idEntidad,
          nombre_departamento: nombreArea
        });
        toast.success('Área creada correctamente');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEntidad = (e) => {
    const inputValue = e.target.value;
    setIdEntidad(inputValue);

    if (inputValue.trim() !== '') {
      return setError('');
    }
  };

  const handlenombre = (e) => {
    const inputValue = e.target.value;
    setNombreArea(inputValue);

    if (inputValue.trim() !== '') {
      return setError('');
    }
  };

  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={() => setCrear(!crear)}>
          <AddIcon />
        </IconButton>
        Crear área
      </TableCell>
      <TableCell>
        {crear && (
          <>
            <select className="form-select mb-2" onChange={handleEntidad}>
              <option value="">Seleccione una entidad</option>
              {entidad.map((entidades) => (
                <option key={entidades._id} value={entidades._id}>
                  {entidades.nombre_entidad}
                </option>
              ))}
            </select>
            <span className="errors">{error}</span>
            <input className="form-control" placeholder="Nombre área" onChange={handlenombre} />
            <span className="errors">{error}</span>
            <button className="btn btn-success mt-2" onClick={() => postApiArea()}>
              Crear
            </button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default CrearArea;

CrearArea.propTypes = {
  toast: PropTypes.func
};
