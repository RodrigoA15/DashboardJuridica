import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import UsuariosJuridica from './UsuariosJuridica';
import { useAuth } from 'context/authContext';
import Loader from 'pages/components-overview/Loader';
import Dot from 'components/@extended/Dot';
import { Stack } from '@mui/material';
import { Typography } from '../../../../node_modules/@mui/material/index';

function GetPendientes() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getDataPendiente();

    const intervalId = setInterval(getDataPendiente, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    diasHabiles(data);
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let fechaInicio = new Date(fecha_radicado);
    let fechaFin = new Date();
    let festivos = ['2023-10-06', '2023-10-05'];

    while (fechaInicio <= fechaFin) {
      const diaSemana = fechaInicio.getDay();
      const fechaActual = fechaInicio.toISOString().split('T')[0];
      const lunes = 1;
      const viernes = 5;

      if (diaSemana >= lunes && diaSemana <= viernes) {
        if (!festivos.includes(fechaActual)) {
          contador++;
        }
      }

      fechaInicio.setDate(fechaInicio.getDate() + 1);
    }

    console.log('Días laborables:', contador);

    return contador;
  };

  const getBackgroundColor = (fechaRadicado) => {
    const diasLaborables = diasHabiles(fechaRadicado);

    if (diasLaborables <= 5) {
      return 'success'; // Verde
    } else if (diasLaborables >= 6 && diasLaborables <= 9) {
      return 'warning'; // Amarillo
    } else if (diasLaborables >= 10 && diasLaborables <= 12) {
      return 'info'; // Naranja
    } else if (diasLaborables >= 13) {
      return 'error'; // Rojo
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número Radicado</TableCell>
              <TableCell align="center">Fecha Radicado</TableCell>
              <TableCell align="center">Asunto</TableCell>
              <TableCell align="center">Procedencia</TableCell>
              <TableCell align="center">Asignar Radicado</TableCell>
              <TableCell align="left">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <TableRow key="error">
                <TableCell colSpan={5}>{error}</TableCell>
              </TableRow>
            ) : (
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pendiente) => (
                <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" align="center">
                    <b>{pendiente.numero_radicado}</b>
                  </TableCell>
                  <TableCell align="center">
                    {new Date(pendiente.fecha_radicado).toLocaleDateString('es-CO', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell align="center">{pendiente.id_asunto.nombre_asunto}</TableCell>
                  <TableCell align="center">
                    {pendiente.id_procedencia.nombre} {pendiente.id_procedencia.apellido}
                  </TableCell>
                  <TableCell align="center">
                    <UsuariosJuridica pendiente={pendiente} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Dot color={getBackgroundColor(new Date(pendiente.fecha_radicado))} size={15} />
                      <Typography>{diasHabiles(new Date(pendiente.fecha_radicado)) + ' Dias'}</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="rowPage"
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default GetPendientes;
