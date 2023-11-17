import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '../../../../node_modules/@mui/material/index';
import axios from 'api/axios';
function TableUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiUsersQx();
  }, []);

  const apiUsersQx = async () => {
    try {
      const response = await axios.get('/usuariosQX');
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error('error de servidor');
    }
  };

  const updateUserQx = async (user) => {
    try {
      console.log(user);
      await axios.put(`/updusuariosQX/${user._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className={user.departamento ? '' : 'blinking'}>
                {user.departamento ? user.departamento.nombre_departamento : 'Pendiente Asignacion'}
              </TableCell>

              <TableCell className={user.role ? '' : 'blinking'}>{(user.role && user.role.nombre_rol) || 'Pendiente Asignacion'}</TableCell>

              <TableCell>
                <button className="btn btn-warning" onClick={() => updateUserQx(user)}>
                  Actualizar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableUsers;
