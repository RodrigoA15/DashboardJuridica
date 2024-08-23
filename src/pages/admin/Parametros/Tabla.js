import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'api/axios';

const TablaParametros = ({ data }) => {
  const [parametros, setParametros] = useState([]);
  useEffect(() => {
    if (data && data.length > 0) {
      setParametros(data);
    }
  }, [data]);

  const handleSwitchChange = async (id, currentValue) => {
    const newValue = !currentValue;

    try {
      await axios.put(`/parameters/${id}`, { activo: newValue });
      setParametros((prevParametros) =>
        prevParametros.map((parametro) => (parametro._id === id ? { ...parametro, activo: newValue } : parametro))
      );
    } catch (error) {
      console.log('Ha ocurrido un error al actualizar el estado del parámetro', error);
    }
  };

  if (parametros.length === 0) {
    return <p>No hay parámetros para mostrar.</p>;
  }

  return (
    <TableContainer component={Paper}>
      <p className="m-3">
        <b>Nota:</b> No activar o desactivar par&aacute;metros establecidos
      </p>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Parámetro</TableCell>
            <TableCell>Activo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parametros.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.nombre_parametro}</TableCell>
              <TableCell>
                <Switch checked={row.activo} onChange={() => handleSwitchChange(row._id, row.activo)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaParametros;

TablaParametros.propTypes = {
  data: PropTypes.array.isRequired
};
