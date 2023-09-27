import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material/index';
import { useAuth } from 'context/authContext';
import { Toaster } from 'sonner';

function PendientesUsuario() {
  const [users, setUser] = useState([]);
  const [Pendiente, setPendiente] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    apiDataUser();
  }, []);

  const apiDataUser = async () => {
    try {
      const response = await axios.get('/asignaciones');
      setUser(response.data);
      setPendiente(response.data.some((pendiente) => user.email === pendiente.id_usuario.email));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número Radicado</TableCell>
              <TableCell align="left">Fecha Radicado</TableCell>
              <TableCell align="left">Fecha Asignacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((pendiente) => (
              <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {user.email === pendiente.id_usuario.email ? (
                  <>
                    <TableCell component="th" scope="row">
                      {pendiente.id_radicado.numero_radicado}
                    </TableCell>
                    <TableCell align="left">{new Date(pendiente.id_radicado.fecha_radicado).toLocaleString()}</TableCell>
                    <TableCell align="left">{new Date(pendiente.fecha_asignacion).toLocaleString()}</TableCell>
                  </>
                ) : null}
              </TableRow>
            ))}
            {!Pendiente && (
              <TableRow key="no-pendiente" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={3}>
                  <p>No tienes PQRS pendientes :D</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PendientesUsuario;
