import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ListArea from './listArea';
import CrearArea from './create';
import { toast, Toaster } from 'sonner';
function IndexArea() {
  return (
    <TableContainer component={Paper}>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre área</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <CrearArea toast={toast} />
          <ListArea toast={toast} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IndexArea;
