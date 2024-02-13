// import React, { useEffect, useState } from 'react';
// import axios from 'api/axios';
// import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
// import UsuariosJuridica from './UsuariosJuridica';
// import { useAuth } from 'context/authContext';
// import Loader from 'pages/components-overview/Loader';
// import Dot from 'components/@extended/Dot';
// import { Stack } from '@mui/material';
// import { Typography } from '@mui/material';

// function GetPendientes() {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [filtro, setFiltro] = useState('');

//   useEffect(() => {
//     getDataPendiente();

//     const intervalId = setInterval(getDataPendiente, 5000);
//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     diasHabiles(data);
//   }, [data]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const getDataPendiente = async () => {
//     try {
//       const response = await axios.get(`/radicados/depjuridica_radicados/${user.departamento._id}`);
//       setData(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('No tienes PQRS Pendientes');
//       } else {
//         setError('Error de servidor');
//       }
//       setIsLoading(false);
//     }
//   };

//   const diasHabiles = (fecha_radicado) => {
//     let contador = -1;
//     let fechaInicio = new Date(fecha_radicado);
//     let fechaFin = new Date();
//     let festivos = ['2023-10-06', '2023-10-05'];

//     while (fechaInicio <= fechaFin) {
//       const diaSemana = fechaInicio.getDay();
//       const fechaActual = fechaInicio.toISOString().split('T')[0];
//       const lunes = 1;
//       const viernes = 5;

//       if (diaSemana >= lunes && diaSemana <= viernes) {
//         if (!festivos.includes(fechaActual)) {
//           contador++;
//         }
//       }

//       fechaInicio.setDate(fechaInicio.getDate() + 1);
//     }
//     return contador;
//   };

//   const getBackgroundColor = (fechaRadicado) => {
//     const diasLaborables = diasHabiles(fechaRadicado);

//     if (diasLaborables <= 5) {
//       return 'success'; // Verde
//     } else if (diasLaborables >= 6 && diasLaborables <= 9) {
//       return 'warning'; // Amarillo
//     } else if (diasLaborables >= 10 && diasLaborables <= 12) {
//       return 'info'; // Naranja
//     } else if (diasLaborables >= 13) {
//       return 'error'; // Rojo
//     }
//   };

//   const filterpendientes = data.filter((pendiente) => pendiente.numero_radicado.includes(filtro));
//   return (
//     <div>
//       <div className="row m-1 mb-3">
//         <input
//           className="form-control w-25"
//           type="text"
//           placeholder="Buscar Respuestas"
//           value={filtro}
//           onChange={(e) => setFiltro(e.target.value)}
//         />
//         <div className="col-4">
//           <button className="btn btn-primary" onClick={getDataPendiente}>
//             Buscar
//           </button>
//         </div>
//       </div>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 350 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Número radicado</TableCell>
//               <TableCell align="center">Fecha radicado</TableCell>
//               <TableCell align="center">Asunto</TableCell>
//               <TableCell align="center">Observaciones</TableCell>
//               <TableCell align="center">Procedencia</TableCell>
//               <TableCell align="center">Asignar radicado</TableCell>
//               <TableCell align="left">Estado</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {isLoading ? (
//               <Loader />
//             ) : error ? (
//               <TableRow key="error">
//                 <TableCell colSpan={5}>{error}</TableCell>
//               </TableRow>
//             ) : (
//               filterpendientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pendiente) => (
//                 <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                   <TableCell component="th" scope="row" align="center">
//                     <b>{pendiente.numero_radicado}</b>
//                   </TableCell>
//                   <TableCell align="center">
//                     {new Date(pendiente.fecha_radicado).toLocaleDateString('es-CO', { timeZone: 'UTC' })}
//                   </TableCell>
//                   <TableCell align="center">{pendiente.id_asunto.nombre_asunto}</TableCell>
//                   <TableCell align="center">{pendiente.observaciones_radicado}</TableCell>
//                   <TableCell align="center">
//                     {pendiente.id_procedencia.nombre} {pendiente.id_procedencia.apellido}
//                   </TableCell>
//                   <TableCell align="center">
//                     <UsuariosJuridica pendiente={pendiente} />
//                   </TableCell>
//                   <TableCell align="center">
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <Dot color={getBackgroundColor(new Date(pendiente.fecha_radicado))} size={15} />
//                       <Typography>{diasHabiles(new Date(pendiente.fecha_radicado)) + ' Dias'}</Typography>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         className="rowPage"
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// }

// export default GetPendientes;

import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'api/axios';
import UsuariosJuridica from 'pages/extra-pages/Juridica/UsuariosJuridica';
import { Stack } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { useAuth } from 'context/authContext';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'Numero radicado',
    numeric: false,
    disablePadding: true,
    label: 'Numero de radicado'
  },
  {
    id: 'fecha_radicado',
    numeric: true,
    disablePadding: false,
    label: 'Fecha radicado'
  },
  {
    id: 'Asunto',
    numeric: false,
    disablePadding: false,
    label: 'Asunto'
  },
  {
    id: 'Observaciones',
    numeric: false,
    disablePadding: false,
    label: 'Observaciones'
  },
  {
    id: 'Procedencia',
    numeric: false,
    disablePadding: false,
    label: 'Procedencia'
  },
  {
    id: 'Asignacion',
    numeric: true,
    disablePadding: false,
    label: 'Asignar radicado'
  },
  {
    id: 'estado',
    numeric: false,
    disablePadding: false,
    label: 'Estado'
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
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
          Nutrition
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

export default function GetPendientes() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('fecha_radicado');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataApi, setDataApi] = React.useState([]);
  const { user } = useAuth();
  React.useEffect(() => {
    dataApiRest();

    const intervalId = setInterval(dataApiRest, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const dataApiRest = async () => {
    try {
      const response = await axios.get(`/radicados/depjuridica_radicados/${user.departamento._id}`);
      setDataApi(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let festivos = ['2023-10-06', '2023-10-05'];
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
      return 'success'; // Verde
    } else if (diasLaborables >= 6 && diasLaborables <= 9) {
      return 'warning'; // Amarillo
    } else if (diasLaborables >= 10 && diasLaborables <= 12) {
      return 'info'; // Naranja
    } else if (diasLaborables >= 13) {
      return 'error'; // Rojo
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dataApi.map((n) => n._id);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataApi.length) : 0;

  const visibleRows = React.useMemo(
    () => stableSort(dataApi, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, dataApi]
  );
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={dataApi.length}
            />
            <TableBody>
              {dataApi.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No tienes peticiones pendientes por asignar
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
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
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.numero_radicado}
                      </TableCell>
                      <TableCell align="right">{new Date(row.fecha_radicado).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</TableCell>
                      <TableCell align="right">{row.id_asunto.nombre_asunto}</TableCell>
                      <TableCell align="right">{row.observaciones_radicado}</TableCell>
                      <TableCell align="right">
                        {row.id_procedencia.nombre} {row.id_procedencia.apellido}
                      </TableCell>

                      <TableCell align="center">
                        <UsuariosJuridica pendiente={row} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Dot color={getBackgroundColor(new Date(row.fecha_radicado))} size={15} />
                          <Typography>{diasHabiles(new Date(row.fecha_radicado)) + ' Dias'}</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataApi.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
    </Box>
  );
}
