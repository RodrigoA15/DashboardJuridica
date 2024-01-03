import React, { useEffect, useState } from 'react';
import ListaAsuntos from './listaAsuntos';
//Material UI >>
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
//Axios
import axios from 'api/axios';
import Entidades from '../Entidad/index';

function Index() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiDataAsuntos = async () => {
      try {
        const response = await axios.get('/asunto/asunto');
        setData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('No se encontraron Asuntos');
        } else {
          setError('Error de servidor');
        }
      }
    };

    apiDataAsuntos();
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7} lg={8} justifyContent="start">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Asuntos por área</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <p>{error}</p>
              ) : (
                <>
                  {data.map((row) => (
                    <ListaAsuntos key={row.nombre_departamento} row={row} />
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item justifyContent="end">
        <Entidades />
      </Grid>
    </Grid>
  );
}

export default Index;
