import { useEffect, useState } from 'react';
import axios from 'api/axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import { Grid, Box } from '@mui/material';
//Icons
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const TablaTardias = () => {
  const [data, setData] = useState([]);
  const [openYears, setOpenYears] = useState({});
  const [openMonths, setOpenMonths] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    answerLate();
  }, []);

  const answerLate = async () => {
    try {
      const response = await axios.get('/answer/answer-late');
      setData(response.data);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const toggleYear = (anio) => {
    setOpenYears((prevState) => ({
      ...prevState,
      [anio]: !prevState[anio]
    }));
  };

  const toggleMonth = (anio, month) => {
    setOpenMonths((prevState) => ({
      ...prevState,
      [`${anio}-${month}`]: !prevState[`${anio}-${month}`]
    }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Beta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <div key={item.anio}>
                    <TableRow>
                      <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => toggleYear(item.anio)}>
                          {openYears[item.anio] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="left">{item.anio}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={6}>
                        <Collapse in={openYears[item.anio]} timeout="auto" unmountOnExit>
                          {item.meses.map((row) => (
                            <div key={row.month}>
                              <TableRow>
                                <TableCell>
                                  <IconButton aria-label="expand month row" size="small" onClick={() => toggleMonth(item.anio, row.month)}>
                                    {openMonths[`${item.anio}-${row.month}`] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                  </IconButton>
                                </TableCell>
                                <TableCell align="left">{row.month}</TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell colSpan={6}>
                                  <Collapse in={openMonths[`${item.anio}-${row.month}`]} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                      <Table size="small" aria-label="purchases">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell align="left">N&uacute;mero radicado</TableCell>
                                            <TableCell align="left">Responsable</TableCell>
                                            <TableCell align="left">Fecha radicado</TableCell>
                                            <TableCell align="left">Fecha respuesta</TableCell>
                                            <TableCell align="left">Días diferencia</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {row.radicados.map((item2) => (
                                            <TableRow key={item2.numero_radicado}>
                                              <TableCell align="left">{item2.numero_radicado}</TableCell>
                                              <TableCell align="left">{item2.responsable}</TableCell>
                                              <TableCell align="left">{item2.fecha_radicado}</TableCell>
                                              <TableCell align="left">{item2.fecha_respuesta}</TableCell>
                                              <TableCell align="left">{item2.dias_diferencia}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </div>
                          ))}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </div>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
