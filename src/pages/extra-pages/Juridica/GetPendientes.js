import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UsuariosJuridica from './UsuariosJuridica';
import { useAuth } from 'context/authContext';

function GetPendientes() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getDataPendiente();

    const intervalId = setInterval(getDataPendiente, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getDataPendiente = async () => {
    try {
      const response = await axios.get(`/radicados/depjuridica_radicados/${user.departamento}`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS Pendientes');
      } else {
        setError('Error de servidor');
      }
      setIsLoading(false);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Número Radicado</TableCell>
            <TableCell align="center">Fecha Radicado</TableCell>
            <TableCell align="center">Asunto</TableCell>
            <TableCell align="center">Departamento</TableCell>
            <TableCell align="center">Asignar Radicado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow key="loading">
              <TableCell colSpan={5}>Cargando...</TableCell>
            </TableRow>
          ) : error ? (
            <TableRow key="error">
              <TableCell colSpan={5}>{error}</TableCell>
            </TableRow>
          ) : (
            data.map((pendiente) => (
              <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {pendiente.numero_radicado}
                </TableCell>
                <TableCell align="center">{new Date(pendiente.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                <TableCell
                  align="center"
                  style={{
                    color: pendiente.id_asunto.nombre_asunto === 'TUTELA' ? 'white' : 'white',
                    background: pendiente.id_asunto.nombre_asunto === 'TUTELA' ? '#e63637' : '#36802d'
                  }}
                >
                  {pendiente.id_asunto.nombre_asunto}
                </TableCell>
                <TableCell align="center">{pendiente.id_departamento.nombre_departamento}</TableCell>
                <TableCell>
                  <UsuariosJuridica pendiente={pendiente} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GetPendientes;
