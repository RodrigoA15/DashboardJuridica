import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from 'context/authContext';

function GetAsignados() {
  const [asignados, setAsignados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    {
      user && apiAsignados();

      const intervalId = setInterval(apiAsignados, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const apiAsignados = async () => {
    try {
      const response = await axios.get(`/asignaciones/${user.departamento}`);
      setAsignados(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No Haz asignado PQRS');
      } else {
        setError('Error de servidor');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell align="left">Fecha Asignacion</TableCell>
              <TableCell align="left">Responsable</TableCell>
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
              asignados.map((i) => (
                <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {i.id_radicado.estado_radicado}
                  </TableCell>
                  <TableCell align="left">{new Date(i.fecha_asignacion).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                  <TableCell>{i.id_usuario.username}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GetAsignados;
