import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, IconButton } from '@mui/material';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
//Componentes
import ModalRespuestas from './ModalRespuestas';
import ModalRadicadosRespuestas from './ModalRadicadosRespuestas';
import Reasignaciones from './Reasignaciones/Reasignaciones';
//Sweet Alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import useDiasHabiles from 'hooks/useDate';

function PendientesUsuario() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isPendiente, setIsPendiente] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [openRespuestasModal, setOpenRespuestasModal] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  //Modal Reasignacion
  const [openReasignacion, setOpenReasignacion] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  //Buscador
  const [filtro, setFiltro] = useState('');

  //Input actualizar contador respuesta
  const [count, setCount] = useState(1);
  const { diasHabiles } = useDiasHabiles();

  useEffect(() => {
    {
      user && apiDataUser();
    }
  }, [user]);

  //TODO consumo de api asignaciones
  const apiDataUser = async () => {
    try {
      const response = await axios.get(`/asignaciones/${user.departamento._id}`);
      setUsers(response.data);
      setIsLoading(false);
      setIsPendiente(response.data.some((pendiente) => user.email === pendiente.id_usuario.email));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS asignadas');
      } else {
        setError(error.response.data);
      }
      setIsLoading(false);
    }
  };
  //Formateo de fechas
  const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { timeZone: 'UTC' });

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpenModal(false);
  };

  const handleOpenR = (respuesta) => {
    setSelectedRespuesta(respuesta);
    setOpenRespuestasModal(true);
  };

  const handleCloseR = () => {
    setSelectedRespuesta(null);
    setOpenRespuestasModal(false);
  };

  //TODO modal reasignaciones
  const handleOpenReasignacion = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setOpenReasignacion(true);
  };

  const handleCloseReasignacion = () => {
    setSelectedAsignacion(null);
    setOpenReasignacion(false);
  };

  //TODO colores de las alertas por dia habil
  const getBackgroundColor = (fechaRadicado) => {
    const diasLaborables = diasHabiles(fechaRadicado);

    if (diasLaborables <= 5) {
      return '#748E63'; // Verde
    } else if (diasLaborables >= 6 && diasLaborables <= 9) {
      return '#FFCD4B'; // Amarillo
    } else if (diasLaborables >= 10 && diasLaborables <= 12) {
      return '#d43a00'; // Naranja
    } else if (diasLaborables >= 13) {
      return '#BB2525'; // Rojo
    }
  };

  //TODO Actualizar contador respuestas estimadas
  const updateCount = async (pendiente) => {
    try {
      const MySwal = withReactContent(Swal);
      const alerta = await MySwal.fire({
        title: '¿Estas seguro de actualizar el contador de respuestas estimadas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#99b080',
        confirmButtonText: 'Si, Actualizar!'
      });

      if (alerta.isConfirmed) {
        const id_radicado = pendiente.id_radicado._id;
        await axios.put(`/radicados/updateQuantity/${id_radicado}`, { cantidad_respuesta: count });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //TODO Buscador
  const filteredPendientes = users.filter((pendiente) => pendiente.id_radicado.numero_radicado.includes(filtro));
  return (
    <div>
      <input
        className="form-control w-25 mb-3"
        type="number"
        placeholder="Buscar..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número radicado</TableCell>
              <TableCell align="left">Fecha radicado</TableCell>
              <TableCell>Asunto</TableCell>
              <TableCell align="left">Fecha asignacion</TableCell>
              <TableCell align="left">Procedencia</TableCell>
              <TableCell align="left">Observaciones</TableCell>
              <TableCell align="left">Respuestas estimadas</TableCell>
              <TableCell align="center">Dias</TableCell>
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
              <>
                {filteredPendientes
                  .sort((a, b) => new Date(a.id_radicado.fecha_radicado) - new Date(b.id_radicado.fecha_radicado))
                  .map((pendiente) => {
                    const isCurrentUserPendiente = user.email === pendiente.id_usuario.email;
                    return (
                      isCurrentUserPendiente && (
                        <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            {pendiente.id_radicado.numero_radicado}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{
                              background: getBackgroundColor(new Date(pendiente.id_radicado.fecha_radicado))
                            }}
                          >
                            {formatDate(pendiente.id_radicado.fecha_radicado)}
                          </TableCell>
                          <TableCell>{pendiente.id_radicado.id_asunto ? pendiente.id_radicado.id_asunto.nombre_asunto : 'N/A'}</TableCell>
                          <TableCell align="left">{formatDate(pendiente.fecha_asignacion)}</TableCell>
                          <TableCell align="left">
                            {pendiente.id_radicado.id_procedencia.nombre} {pendiente.id_radicado.id_procedencia.apellido}
                          </TableCell>
                          <TableCell>{pendiente.id_radicado.observaciones_radicado}</TableCell>
                          <TableCell align="left">
                            {pendiente.id_radicado.cantidad_respuesta}
                            {/* Agregar respuestas Juridica */}
                            {user && user.departamento && user.departamento.nombre_departamento === 'Juridica' && (
                              <>
                                <TextField
                                  className="ml-2"
                                  id="outlined-number"
                                  type="number"
                                  size="small"
                                  onChange={(e) => setCount(e.target.value)}
                                />
                                <IconButton onClick={() => updateCount(pendiente)}>
                                  <EditIcon />
                                </IconButton>
                              </>
                            )}
                            {/*  */}
                          </TableCell>
                          <TableCell>{diasHabiles(new Date(pendiente.id_radicado.fecha_radicado))}</TableCell>
                          <TableCell align="center">
                            <Button color="primary" startIcon={<AddIcon />} onClick={() => handleOpen(pendiente)}>
                              Agregar Respuesta
                            </Button>
                            <Button color="secondary" startIcon={<VisibilityIcon />} onClick={() => handleOpenR(pendiente)}>
                              Ver Respuestas
                            </Button>
                            <Button startIcon={<SendIcon />} onClick={() => handleOpenReasignacion(pendiente)}>
                              Reasignación
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    );
                  })}
                {!isPendiente && (
                  <TableRow key="no-pendiente" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell colSpan={3}>
                      <p>No tienes PQRS pendientes :D</p>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalRespuestas open={openModal} handleClose={handleClose} data={selectedData} />
      <ModalRadicadosRespuestas opens={openRespuestasModal} handleCloses={handleCloseR} respuestas={selectedRespuesta} />
      <Reasignaciones open={openReasignacion} close={handleCloseReasignacion} asignaciones={selectedAsignacion} />
    </div>
  );
}

export default PendientesUsuario;
