import React from 'react';
import { Grid, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { TableBody } from '@mui/material';
import ListCanales from './listCanales';
import IndexArea from '../Areas/index';
import CrearCanal from './create';
import { Toaster, toast } from 'sonner';

function IndexCE() {
  return (
    <Grid container spacing={2}>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Grid item xs={6}>
        <Typography variant="h5">Canal de entrada</Typography>
        <Paper>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre canal de entrada</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <CrearCanal toast={toast} />
                <ListCanales toast={toast} />
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="h5">Áreas</Typography>
        <Paper>
          <IndexArea />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default IndexCE;
