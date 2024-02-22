import MainCard from 'components/MainCard';
import { Grid, Typography } from '@mui/material';
import ChartEntidadAdmin from './chart';
import ChartArea from './chartArea';
import ChartEstados from './chartEstados';

function IndexResumen() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={8} md={5}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Resumen</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <ChartArea />
        </MainCard>
      </Grid>

      <Grid item xs={8} md={5}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Resumen</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <ChartEstados />
        </MainCard>
      </Grid>

      {/* Entidades */}
      <Grid item xs={8} md={5}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Resumen</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <ChartEntidadAdmin />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default IndexResumen;
