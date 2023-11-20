import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'api/axios';
import ModalUsuarios from './modalUsuarios';
function TableUsers() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

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

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpenModal(false);
  };

  return (
    <div>
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

                <TableCell className={user.role ? '' : 'blinking'}>
                  {(user.role && user.role.nombre_rol) || 'Pendiente Asignacion'}
                </TableCell>

                <TableCell>
                  <button className="btn btn-warning" onClick={() => handleOpen(user)}>
                    Actualizar
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalUsuarios open={openModal} handleClose={handleClose} data={selectedData} />
    </div>
  );
}

export default TableUsers;
