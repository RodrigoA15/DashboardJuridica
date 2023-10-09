import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from 'context/authContext';
import { Toaster } from 'sonner';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import ModalRespuestas from './ModalRespuestas';
import ModalRadicadosRespuestas from './ModalRadicadosRespuestas';

function PendientesUsuario() {
  const [users, setUser] = useState([]);
  const [Pendiente, setPendiente] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [abrir, setAbrir] = useState(false);
  const [seleccionar, setSeleccionar] = useState(null);

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

  const handleOpenR = (respuesta) => {
    setSeleccionar(respuesta);
    setAbrir(true);
  };

  const handleCloseR = () => {
    setSeleccionar(null);
    setAbrir(false);
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
                      <Button color="secondary" startIcon={<VisibilityIcon />} onClick={() => handleOpenR(pendiente)}>
                        Ver Respuestas
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
          <ModalRadicadosRespuestas open={abrir} handleClose={handleCloseR} respuesta={seleccionar} />
        </Table>
      </TableContainer>
    </div>
  );
}

export default PendientesUsuario;
