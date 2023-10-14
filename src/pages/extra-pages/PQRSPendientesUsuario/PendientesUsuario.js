import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
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

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número Radicado</TableCell>
              <TableCell align="left">Fecha Radicado</TableCell>
              <TableCell align="left">Fecha Asignacion</TableCell>
              <TableCell align="left">Respuestas estimadas</TableCell>
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
                        <TableCell align="left">{formatDate(pendiente.id_radicado.fecha_radicado)}</TableCell>
                        <TableCell align="left">{formatDate(pendiente.fecha_asignacion)}</TableCell>
                        <TableCell align="left">{pendiente.id_radicado.cantidad_respuesta}</TableCell>
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
