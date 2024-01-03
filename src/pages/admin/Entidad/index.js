import React from 'react';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody } from '@mui/material';
import ListaEntidad from './listaEntidad';

function Index() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre entidad</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ListaEntidad />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Index;
