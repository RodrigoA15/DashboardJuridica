import React, { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'api/axios';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '../../../../node_modules/@mui/material/index';

function Preasignaciones() {
  const [data, setData] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getAllPreasignaciones();
  }, []);

  const getAllPreasignaciones = async () => {
    try {
      const response = await axios.get('/preasignados');
      setData(response.data);
      setUpdating(true);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatePreasignacion = async (pre) => {
    try {
      await axios.put(`/radicados/radicados/${pre._id}`, {
        estado_radicado: 'Pendiente'
      });
      setUpdating(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Número Radicado</TableCell>
            <TableCell align="left">Fecha Radicado</TableCell>
            <TableCell align="left">Asunto</TableCell>
            <TableCell align="left">Departamento</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((pre) => (
            <TableRow key={pre._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {updating ? (
                <>
                  <TableCell component="th" scope="row">
                    {pre.numero_radicado}
                  </TableCell>
                  <TableCell align="left">{new Date(pre.fecha_radicado).toLocaleDateString()}</TableCell>
                  <TableCell align="left">{pre.id_asunto.nombre_asunto}</TableCell>
                  <TableCell align="left">{pre.id_departamento.nombre_departamento}</TableCell>

                  <TableCell align="center">
                    <Button color="success" startIcon={<DoneIcon />} onClick={() => updateStatePreasignacion(pre)}>
                      Aceptar
                    </Button>
                    <Button color="error" startIcon={<CloseIcon />}>
                      Rechazar
                    </Button>
                  </TableCell>
                </>
              ) : (
                <p>No tienes nada</p>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Preasignaciones;
