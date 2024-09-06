import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
import useDiasHabiles from 'hooks/useDate';
import { classNames } from 'primereact/utils';
import { TablePagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
const TablaVencidas = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { diasHabiles } = useDiasHabiles();
  const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2' }
      }
    },
    esES
  );
  useEffect(() => {
    getPQRSexpired();
  }, []);

  const getPQRSexpired = async () => {
    try {
      const response = await axios.get('/radicados/vencidas');
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const extractMonth = (fecha) => {
    const date = new Date(fecha).getMonth() + 1;
    return date;
  };

  const extractYear = (fecha) => {
    const date = new Date(fecha).getFullYear();
    return date;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = useMemo(() => {
    return [...data].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const getBackgroundColor = (rowData) => {
    const diasLaborables = diasHabiles(rowData);

    const hola = classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'dias text-dark': diasLaborables >= 10 && diasLaborables <= 12,
      'bg-danger bg-gradient text-dark': diasLaborables >= 13
    });

    return <div className={hola}>{diasLaborables}</div>;
  };

  if (loading) {
    return <div>Cargando...</div>; // O cualquier indicador de carga
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Año</TableCell>
              <TableCell align="center">Mes</TableCell>
              <TableCell align="center">&aacute;rea</TableCell>
              <TableCell align="center">Responsable</TableCell>
              <TableCell align="center">N&uacute;mero radicado</TableCell>
              <TableCell align="center">Fecha asignaci&oacute;n</TableCell>
              <TableCell align="center">Tiempo sin respuesta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows
              .filter((item) => diasHabiles(item.fecha_radicado) >= 10)
              .map((item) => (
                <TableRow key={item.numero_radicado}>
                  <TableCell align="center">{extractYear(item.fecha_radicado)}</TableCell>
                  <TableCell align="center">{extractMonth(item.fecha_radicado)}</TableCell>
                  <TableCell align="center">{item.id_departamento}</TableCell>
                  <TableCell align="center">{item.id_usuario}</TableCell>
                  <TableCell align="center">{item.numero_radicado}</TableCell>
                  <TableCell align="center">{item.fecha_asignacion}</TableCell>
                  <TableCell align="center">{getBackgroundColor(item.fecha_radicado)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ThemeProvider theme={theme}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
    </>
  );
};

export default TablaVencidas;
