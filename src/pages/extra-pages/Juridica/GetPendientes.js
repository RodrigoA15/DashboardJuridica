import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UsuariosJuridica from './UsuariosJuridica';

function GetPendientes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDataPendiente();
  }, []);

  const getDataPendiente = async () => {
    try {
      const response = await axios.get('/radicados/depjuridica_radicados');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Número Radicado</TableCell>
            <TableCell align="left">Fecha Radicado</TableCell>
            <TableCell align="left">Asunto</TableCell>
            <TableCell align="left">Departamento</TableCell>
            <TableCell align="left">Asignar Radicado</TableCell>
            <TableCell align="left">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((pendiente) => (
            <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {pendiente.numero_radicado}
              </TableCell>
              <TableCell align="left">{new Date(pendiente.fecha_radicado).toLocaleDateString()}</TableCell>
              <TableCell align="left">{pendiente.id_asunto.nombre_asunto}</TableCell>
              <TableCell align="left">{pendiente.id_departamento.nombre_departamento}</TableCell>
              <TableCell>
                <UsuariosJuridica pendiente={pendiente} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GetPendientes;
