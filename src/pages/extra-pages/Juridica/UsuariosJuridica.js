import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '../../../../node_modules/@mui/material/index';
import axios from 'api/axios';

function UsuariosJuridica() {
  const [users, setUsers] = useState([]);
  const [usuarios, setUsuarios] = useState('');

  useEffect(() => {
    apiUsuarios();
  }, []);

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
    </div>
  );
}

export default UsuariosJuridica;
