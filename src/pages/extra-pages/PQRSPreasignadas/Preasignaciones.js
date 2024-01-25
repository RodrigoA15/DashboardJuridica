import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';
import ModalReasignacion from './ModalReasignacion';
import { useAuth } from 'context/authContext';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

function Preasignaciones() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale, setLocale] = useState('esES');

  useEffect(() => {
    {
      user && getAllPreasignaciones();

      const intervalId = setInterval(getAllPreasignaciones, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpen(false);
  };

  const handleChangePage = (event, newPage, newValue) => {
    setPage(newPage);
    setLocale(newValue);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllPreasignaciones = async () => {
    try {
      const response = await axios.get(`/preasignados/${user.departamento._id}`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS preasignadas');
      } else {
        setError('Error de servidor');
      }
      setIsLoading(false);
    }
  };

  const updateStatePreasignacion = async (pre) => {
    const MySwal = withReactContent(Swal);

    const alert = await MySwal.fire({
      title: '¿Está seguro de aceptar esta petición?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar'
    });

    if (alert.isConfirmed) {
      try {
        await axios.put(`/radicados/radicados/${pre._id}`, {
          estado_radicado: 'Pendiente'
        });
        // Actualiza el estado solo para el elemento pre seleccionado

        setData((prevData) => prevData.map((item) => (item._id === pre._id ? { ...item, estado_radicado: 'Pendiente' } : item)));

        toast.success('Petición aceptada correctamente');
      } catch (error) {
        console.error('Error al actualizar el estado de la petición:', error);
        toast.error('Error al aceptar la petición');
      }
    } else {
      toast.error('No se aceptó la petición');
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número radicado</TableCell>
              <TableCell align="left">Fecha radicado</TableCell>
              <TableCell align="left">Asunto</TableCell>
              <TableCell align="left">Correo electrónico</TableCell>
              <TableCell>Observaciones</TableCell>
              <TableCell align="left">Departamento</TableCell>
              <TableCell align="center">Acciones</TableCell>
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
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pre) => (
                <TableRow key={pre._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {pre.numero_radicado}
                  </TableCell>
                  <TableCell align="left">{new Date(pre.fecha_radicado).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</TableCell>
                  <TableCell align="left">{pre.id_asunto.nombre_asunto}</TableCell>
                  <TableCell align="left">{pre.id_procedencia.correo ? pre.id_procedencia.correo : 'No registra'}</TableCell>

                  <TableCell align="left">{pre.observaciones_radicado}</TableCell>
                  <TableCell align="left">{pre.id_departamento.nombre_departamento}</TableCell>
                  <TableCell align="center">
                    <Button className="card2 " size="small" variant="contained" onClick={() => updateStatePreasignacion(pre)}>
                      Aceptar
                    </Button>
                    <Button className="card4 ms-3" size="small" variant="contained" onClick={() => handleOpen(pre)}>
                      Rechazar
                    </Button>
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
      <ModalReasignacion open={open} handleClose={handleClose} data={selectedData} />
    </div>
  );
}

export default Preasignaciones;
