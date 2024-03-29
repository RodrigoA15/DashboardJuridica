import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'context/authContext';
import { Stack, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

function GetAsignados() {
  const [asignados, setAsignados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  //Paginator
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale, setLocale] = useState('esES');
  //Buscador
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    {
      user && apiAsignados();

      const intervalId = setInterval(apiAsignados, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  //Paginacion
  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);
  const handleChangePage = (event, newPage, newValue) => {
    setPage(newPage);
    setLocale(newValue);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //
  const apiAsignados = async () => {
    try {
      const response = await axios.get(`/asignaciones/${user.departamento._id}`);
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
    let contador = 0;
    let festivos = ['2024-03-25', '2024-03-28', '2024-03-29'];
    let fechaInicio = new Date(fecha_radicado);
    let fechaCalculo = new Date(fechaInicio);
    fechaCalculo.setDate(fechaCalculo.getDate() + 1);
    let fechaFin = new Date();

    while (fechaCalculo <= fechaFin) {
      const diaSemana = fechaCalculo.getDay();

      if (diaSemana !== 5 && diaSemana !== 6 && !festivos.includes(fechaCalculo.toISOString().slice(0, 10))) {
        contador++;
      }

      fechaCalculo.setDate(fechaCalculo.getDate() + 1);
    }
    return contador;
  };

  const getBackgroundColor = (fechaRadicado) => {
    const diasLaborables = diasHabiles(fechaRadicado);

    if (diasLaborables <= 5) {
      return 'success'; // 0-5
    } else if (diasLaborables >= 6 && diasLaborables <= 9) {
      return 'warning'; // 6-10
    } else if (diasLaborables >= 10 && diasLaborables <= 12) {
      return 'info'; // Naranja
    } else if (diasLaborables >= 13) {
      return 'error'; // Rojo
    }
  };

  //Buscador
  const filterAsignados = asignados.filter((asignado) => {
    return !asignado.id_radicado.numero_radicado.includes(filtro)
      ? asignado.id_usuario.username.includes(filtro)
      : 'No se encontrarón resultados';
  });

  return (
    <div>
      <input
        className="form-control w-25 mb-3"
        type="text"
        placeholder="Buscar..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Número radicado</TableCell>
              <TableCell>Fecha radicado</TableCell>
              <TableCell>Asunto</TableCell>
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
              filterAsignados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((i) => (
                <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {i.id_radicado.estado_radicado}
                  </TableCell>
                  <TableCell>{i.id_radicado.numero_radicado}</TableCell>
                  <TableCell
                    style={{
                      background: getBackgroundColor(new Date(i.id_radicado.fecha_radicado))
                    }}
                  >
                    {new Date(i.id_radicado.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell align="left">{i.id_radicado.id_asunto.nombre_asunto}</TableCell>
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
      <ThemeProvider theme={themeWithLocale}>
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
      </ThemeProvider>
    </div>
  );
}

export default GetAsignados;
