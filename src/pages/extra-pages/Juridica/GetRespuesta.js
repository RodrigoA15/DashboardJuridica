import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';

import { useState } from 'react';
import { toast } from '../../../../node_modules/sonner/dist/index';
import { Toaster } from '../../../../node_modules/sonner/dist/index';

function GetRespuesta() {
  const [respondidos, setRespondidos] = useState([]);
  const { user } = useAuth();
  const [numero_radicado, setNumeroRadicado] = useState('');

  const apiGetRespuesta = async () => {
    if (numero_radicado.trim() === '') {
      toast.error('Termino busqeuda no debe estar vacio');
      return;
    }
    try {
      const response = await axios.get(`/radicados_respuestas/${user.departamento}/${numero_radicado}`);
      setRespondidos(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron resultados en la busqueda');
      }
    }
  };

  return (
    <div>
      <input type="text" placeholder="Buscar" onChange={(e) => setNumeroRadicado(e.target.value)} />
      <button onClick={apiGetRespuesta}>Buscar</button>
      <Toaster position="top-right" richColors />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número Radicado</TableCell>
              <TableCell align="left">Asunto</TableCell>
              <TableCell align="left">Responsable</TableCell>
              <TableCell>Número Radicado respuestas</TableCell>
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
                <TableCell align="left">{i.numero_radicado_respuesta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GetRespuesta;
