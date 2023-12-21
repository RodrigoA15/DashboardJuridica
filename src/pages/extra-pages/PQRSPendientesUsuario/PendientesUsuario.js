import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { Toaster } from 'sonner';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
import ModalRespuestas from './ModalRespuestas';
import ModalRadicadosRespuestas from './ModalRadicadosRespuestas';

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
  const [contador, setContador] = useState({});

  useEffect(() => {
    {
      user && apiDataUser();

      const intervalId = setInterval(apiDataUser, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const apiDataUser = async () => {
    try {
      const response = await axios.get(`/asignaciones/${user.departamento}`);
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

  const countAnswers = (pendiente) => {
    setContador((prevContador) => ({
      ...prevContador,
      [pendiente.id_radicado._id]: (prevContador[pendiente.id_radicado._id] || 0) + 1
    }));
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

    return contador;
  };

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

  const updateCount = async (pendiente) => {
    try {
      const id_radicado = pendiente.id_radicado._id;
      const cantidad = pendiente.id_radicado.cantidad_respuesta + (contador[id_radicado] || 0);
      await axios.put(`/radicados/updateQuantity/${id_radicado}`, { cantidad_respuesta: cantidad });
      setContador((prevContador) => ({
        ...prevContador,
        [id_radicado]: 0
      }));
    } catch (error) {
      console.log(error);
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
              <TableCell align="left">Fecha asignacion</TableCell>
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
                {users.map((pendiente) => {
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
                        <TableCell align="left">{formatDate(pendiente.fecha_asignacion)}</TableCell>
                        <TableCell align="left">
                          {pendiente.id_radicado.cantidad_respuesta}
                           {/* - {contador[pendiente.id_radicado._id] || 0} */}
                          <IconButton onClick={() => countAnswers(pendiente)}>
                            <AddIcon />
                          </IconButton>
                          <IconButton onClick={() => updateCount(pendiente)}>
                            <DoneIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>{diasHabiles(new Date(pendiente.id_radicado.fecha_radicado))}</TableCell>
                        <TableCell align="center">
                          <Button color="primary" startIcon={<AddIcon />} onClick={() => handleOpen(pendiente)}>
                            Agregar Respuesta
                          </Button>
                          <Button color="secondary" startIcon={<VisibilityIcon />} onClick={() => handleOpenR(pendiente)}>
                            Ver Respuestas
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
    </div>
  );
}

export default PendientesUsuario;
