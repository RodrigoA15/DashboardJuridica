import React, { useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';

import { useState } from 'react';
import PDFViewerAnswers from './PDFViewerAnswers';

function GetRespuesta() {
  const [respondidos, setRespondidos] = useState([]);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    apiGetRespuesta();
  }, []);

  const apiGetRespuesta = async () => {
    try {
      const response = await axios.get(`/respuestasArea/${user.departamento._id}`);
      setRespondidos(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No se encontraron resultados en la busqueda');
      }
    }
  };

  const filteredAnswers = respondidos.filter((answer) => answer.id_asignacion.id_radicado.numero_radicado.includes(filtro));

  return (
    <div>
      <div className="row m-1 mb-3">
        <input
          className="form-control w-25"
          type="text"
          placeholder="Buscar Respuestas"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="col-4">
          <button className="btn btn-primary" onClick={apiGetRespuesta}>
            Buscar
          </button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número radicado</TableCell>
              <TableCell align="left">Asunto</TableCell>
              <TableCell align="left">Responsable</TableCell>
              <TableCell>Número radicado respuestas</TableCell>
              <TableCell>Archivo Cargado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow key="error">
                <TableCell colSpan={5}>{error}</TableCell>
              </TableRow>
            ) : (
              <>
                {filteredAnswers.map((i) => (
                  <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {i.id_asignacion.id_radicado.numero_radicado}
                    </TableCell>
                    <TableCell align="left">{i.id_asignacion.id_radicado.id_asunto.nombre_asunto}</TableCell>
                    <TableCell align="left">{i.id_asignacion.id_usuario.username}</TableCell>
                    <TableCell align="left">{i.numero_radicado_respuesta}</TableCell>
                    <PDFViewerAnswers dataAnswer={i} />
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GetRespuesta;
