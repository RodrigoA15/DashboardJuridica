import React, { useEffect, useMemo } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { useState } from 'react';
import PDFViewerAnswers from './PDFViewerAnswers';

function GetRespuesta() {
  const [respondidos, setRespondidos] = useState([]);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale, setLocale] = useState('esES');

  useEffect(() => {
    apiGetRespuesta();
  }, []);

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

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

  const handleChangePage = (event, newPage, newValue) => {
    setPage(newPage);
    setLocale(newValue);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                {filteredAnswers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((i) => (
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
      <ThemeProvider theme={themeWithLocale}>
        <TablePagination
          className="rowPage"
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={respondidos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
    </div>
  );
}

export default GetRespuesta;
