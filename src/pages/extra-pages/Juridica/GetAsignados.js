import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from 'context/authContext';
import { Stack, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';

function GetAsignados() {
  const [asignados, setAsignados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    {
      user && apiAsignados();

      const intervalId = setInterval(apiAsignados, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const diasHabiles = (fecha_radicado) => {
    let contador = -1;
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
              <TableCell>Estado</TableCell>
              <TableCell>Fecha radicado</TableCell>
              <TableCell align="left">Fecha asignacion</TableCell>
              <TableCell align="left">Responsable</TableCell>
              <TableCell align="left">Dias</TableCell>
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
              asignados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((i) => (
                <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {i.id_radicado.estado_radicado}
                  </TableCell>
                  <TableCell
                    style={{
                      background: getBackgroundColor(new Date(i.id_radicado.fecha_radicado))
                    }}
                  >
                    {new Date(i.id_radicado.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell align="left">{new Date(i.fecha_asignacion).toLocaleDateString()}</TableCell>
                  <TableCell>{i.id_usuario.username}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Dot color={getBackgroundColor(new Date(i.id_radicado.fecha_radicado))} size={15} />
                      <Typography>{diasHabiles(new Date(i.id_radicado.fecha_radicado)) + ' Dias'}</Typography>
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
        count={asignados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default GetAsignados;
