import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from 'context/authContext';
import { Toaster } from 'sonner';
import { Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from '../../../../node_modules/sonner/dist/index';
import ModalRespuestas from './ModalRespuestas';

function PendientesUsuario() {
  const [users, setUser] = useState([]);
  const [Pendiente, setPendiente] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    apiDataUser();

    const intervalId = setInterval(apiDataUser, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpen = (data) => {
    setSelected(data);
    setOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpen(false);
  };

  const apiDataUser = async () => {
    try {
      const response = await axios.get('/asignaciones');
      setUser(response.data);
      setPendiente(response.data.some((pendiente) => user.email === pendiente.id_usuario.email));
    } catch (error) {
      console.log(error);
    }
  };

  const updateEstadoRespondido = async (id_radicado) => {
    try {
      const MySwal = withReactContent(Swal);
      const alert = await MySwal.fire({
        title: 'Esta seguro de responder?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, modificar',
        cancelButtonText: 'Cancelar'
      });

      if (alert.isConfirmed) {
        await axios.put(`radicados/radicados/${id_radicado}`, {
          estado_radicado: 'Respuesta'
        });
        toast.success('Respondido correctamente');
      } else {
        toast.error('No se respondio la peticion');
      }
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
              <TableCell>Número Radicado</TableCell>
              <TableCell align="left">Fecha Radicado</TableCell>
              <TableCell align="left">Fecha Asignacion</TableCell>
              <TableCell align="left">Respuestas estimadas</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((pendiente) => (
              <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {user.email === pendiente.id_usuario.email ? (
                  <>
                    <TableCell component="th" scope="row">
                      {pendiente.id_radicado.numero_radicado}
                    </TableCell>
                    <TableCell align="left">{new Date(pendiente.id_radicado.fecha_radicado).toLocaleString()}</TableCell>
                    <TableCell align="left">{new Date(pendiente.fecha_asignacion).toLocaleString()}</TableCell>
                    <TableCell align="left">{pendiente.id_radicado.cantidad_respuesta}</TableCell>
                    <TableCell align="center">
                      <Button color="primary" startIcon={<AddIcon />} onClick={() => handleOpen(pendiente)}>
                        Agregar Respuesta
                      </Button>
                      <Button color="success" startIcon={<DoneIcon />} onClick={() => updateEstadoRespondido(pendiente.id_radicado._id)}>
                        Responder
                      </Button>
                      <Button color="secondary" startIcon={<SendIcon />}>
                        Reasignar
                      </Button>
                    </TableCell>
                  </>
                ) : null}
              </TableRow>
            ))}
            {!Pendiente && (
              <TableRow key="no-pendiente" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={3}>
                  <p>No tienes PQRS pendientes :D</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <ModalRespuestas open={open} handleClose={handleClose} data={selected} />
        </Table>
      </TableContainer>
    </div>
  );
}

export default PendientesUsuario;
