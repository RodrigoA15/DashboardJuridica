import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'api/axios';
import { Button, TableCell } from '../../../../node_modules/@mui/material/index';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function UsuariosJuridica({ pendiente }) {
  const [users, setUsers] = useState([]);
  const [usuarios, setUsuarios] = useState('');
  useEffect(() => {
    apiUsuarios();
  }, []);

  //Listado de usuarios
  const apiUsuarios = async () => {
    try {
      const response = await axios.get('/departamentos/legal_user');
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setUsuarios(event.target.value);
  };

  //Asignacion de id_usuario y estado :Asignados
  const actualizacionEstado = async () => {
    try {
      const MySwal = withReactContent(Swal);
      const result = await MySwal.fire({
        title: 'Esta seguro de asignar el radicado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, modificar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.put(`/radicados/radicados/${pendiente._id}`, {
          estado_radicado: 'Asignados'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Metodo post para asignar radicado a usuarios
  const asignar = async () => {
    try {
      await axios.post(`/asignacion`, {
        id_usuario: usuarios,
        id_radicado: pendiente._id,
        fecha_asignacion: new Date()
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = () => {
    actualizacionEstado();
    asignar();
  };
  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Judicantes</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Judicantes" value={usuarios} onChange={handleChange}>
            {users.map((usuarios) => (
              <MenuItem key={usuarios._id} value={usuarios._id}>
                {usuarios.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableCell>
        <Button variant="outlined" onClick={handleButtonClick}>
          Asignar
        </Button>
      </TableCell>
    </div>
  );
}

export default UsuariosJuridica;

UsuariosJuridica.propTypes = {
  pendiente: PropTypes.object.isRequired
};
