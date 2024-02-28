import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Checkbox,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';
import ModalReasignacion from './ModalReasignacion';
import { useAuth } from 'context/authContext';
import { createTheme, ThemeProvider, useTheme, alpha } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import PropTypes from 'prop-types';
//Icons
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} Seleccionados
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Asignación masiva de peticiones
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

function Preasignaciones() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale, setLocale] = useState('esES');
  const [filtro, setFiltro] = useState('');
  useEffect(() => {
    {
      user && getAllPreasignaciones();

      const intervalId = setInterval(getAllPreasignaciones, 5000);
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
  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpen(false);
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
        await axios.put(`/radicados/radicadosPre/`, {
          _id: selected
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filterPreasignaciones = data.filter((pre) =>
    !pre.numero_radicado.includes(filtro) ? pre.id_asunto.nombre_asunto.includes(filtro) : 'No se encontraron resultados en la busqueda'
  );

  return (
    <Box>
      <Paper>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div>
          <Toaster position="top-right" richColors expand={true} offset="80px" />
          <div className="row m-1 mb-3">
            <input
              className="form-control w-25"
              type="text"
              placeholder="Buscar Respuestas"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <div className="col-4">
              <button className="btn btn-primary" onClick={getAllPreasignaciones}>
                Buscar
              </button>
            </div>
            <div className="col-4 m-1">
              {selected.length > 0 ? (
                <>
                  <Button className="card2 " size="small" variant="contained" onClick={() => updateStatePreasignacion(selected)}>
                    Aceptar
                  </Button>
                  <Button className="card4 ms-3" size="small" variant="contained" onClick={() => handleOpen(selected)}>
                    Rechazar
                  </Button>
                </>
              ) : (
                <div>Seleccione una peticion</div>
              )}
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 350 }} aria-label="simple table">
              <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={data.length} />
              <TableHead>
                <TableRow>
                  <TableCell>Número radicado</TableCell>
                  <TableCell align="left">Fecha radicado</TableCell>
                  <TableCell align="left">Asunto</TableCell>
                  <TableCell align="left">Correo electrónico</TableCell>
                  <TableCell>Observaciones</TableCell>
                  <TableCell align="left">Departamento</TableCell>
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
                  filterPreasignaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pre, index) => {
                    const isItemSelected = isSelected(pre._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, pre._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={pre._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId
                            }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {pre.numero_radicado}
                        </TableCell>
                        <TableCell align="left">{new Date(pre.fecha_radicado).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</TableCell>
                        <TableCell align="left">{pre.id_asunto.nombre_asunto}</TableCell>
                        <TableCell align="left">{pre.id_procedencia.correo ? pre.id_procedencia.correo : 'No registra'}</TableCell>
                        <TableCell align="left">{pre.observaciones_radicado}</TableCell>
                        <TableCell align="left">{pre.id_departamento.nombre_departamento}</TableCell>
                      </TableRow>
                    );
                  })
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
      </Paper>
    </Box>
  );
}

export default Preasignaciones;
