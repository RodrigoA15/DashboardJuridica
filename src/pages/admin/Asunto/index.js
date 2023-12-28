import React from 'react';
import { Grid } from '../../../../node_modules/@mui/material/index';
import ListaAsuntos from './listaAsuntos';

function Index() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <ListaAsuntos />
      </Grid>
    </Grid>
  );
}

export default Index;
