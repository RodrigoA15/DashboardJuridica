import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'api/axios';

import { useEffect, useState } from 'react';

function GetRespuesta() {
  const [respondidos, setRespondidos] = useState([]);

  useEffect(() => {
    apiGetRespuesta();
  }, []);

  const apiGetRespuesta = async () => {
    try {
      const response = await axios.get('/respuestas_juridica');
      setRespondidos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número Radicado</TableCell>
              <TableCell align="left">Asunto</TableCell>
              <TableCell align="left">Responsable</TableCell>
              <TableCell align="left">Evidencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {respondidos.map((i) => (
              <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {i.id_asignacion.id_radicado.numero_radicado}
                </TableCell>
                <TableCell align="left">{i.id_asignacion.id_radicado.id_asunto.nombre_asunto}</TableCell>
                <TableCell align="left">{i.id_asignacion.id_usuario.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GetRespuesta;
