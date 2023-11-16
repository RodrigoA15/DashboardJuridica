import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import MainCard from 'components/MainCard';
import EstadoDepartamento from './estadoDepartamentos';

function AdminRadicados() {
  const [dataRadicados, setDataRadicados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 0);
  const dateEndMonth = new Date();
  const [startDate, setStartDate] = useState(dateFirstMonth);
  const [endDate, setEndDate] = useState(dateEndMonth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale, setLocale] = useState('esES');

  useEffect(() => {
    apiDataRadicados();
  }, [startDate, endDate]);

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

  const apiDataRadicados = async () => {
    try {
      const response = await axios.get(`/radicados/radicadosAdmin/${startDate}/${endDate}`);
      setDataRadicados(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados');
      } else {
        toast.error('Error de servidor');
      }
      setIsLoading(false);
    }
  };

  const handleFechaInicio = (e) => {
    setStartDate(e.target.value);
  };

  const handleFechaFin = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <TableContainer component={Paper}>
          <div className="row m-1">
            <div className="col">
              <input className="form-control" type="date" value={startDate} onChange={handleFechaInicio} />
            </div>
            <div className="col">
              <input className="form-control" type="date" value={endDate} onChange={handleFechaFin} />
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={() => apiDataRadicados()}>
                Buscar
              </button>
            </div>
          </div>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Numero Radicado</TableCell>
                <TableCell>Fecha Radicado</TableCell>
                <TableCell>Cantidad Respuesta</TableCell>
                {/* <TableCell>Procedencia</TableCell> */}
                <TableCell>Canal Entrada</TableCell>
                <TableCell>Asunto</TableCell>
                <TableCell>Tipificacion</TableCell>
                <TableCell>Entidad</TableCell>
                <TableCell>Area Encargada</TableCell>
                <TableCell>Estado Radicado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>Cargando...</TableCell>
                </TableRow>
              ) : (
                dataRadicados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => (
                  <TableRow key={data._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {data.numero_radicado}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {data.fecha_radicado}
                    </TableCell>
                    <TableCell>{data.cantidad_respuesta}</TableCell>
                    {/* <TableCell>{data.id_procedencia.nombre}</TableCell> */}
                    <TableCell>{data.id_canal_entrada.nombre_canal}</TableCell>
                    <TableCell className={data.id_asunto.nombre_asunto === 'TUTELA' ? 'blinking' : ''}>
                      {data.id_asunto.nombre_asunto}
                    </TableCell>
                    <TableCell>{data.id_tipificacion.nombre_tipificacion}</TableCell>
                    <TableCell>{data.id_entidad.nombre_entidad}</TableCell>
                    <TableCell>{data.id_departamento?.nombre_departamento}</TableCell>
                    <TableCell>{data.estado_radicado}</TableCell>
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
            count={dataRadicados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        <MainCard sx={{ mt: 2 }} content={false}>
          <EstadoDepartamento />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default AdminRadicados;
