import MainCard from 'components/MainCard';
import { Grid, Typography } from '@mui/material';
import ChartArea from './chartArea';
import { ChartEstados } from './chartEstados';
import { BarChart } from './StatesByUser';
import { TableUsersAnswer } from './tableUsersAnswer';
import ChartRadicadosAnswer from 'pages/dashboard/ChartRadicadosAnswer';
import { Parameters } from 'hooks/useParameters';
import { useEffect, useState } from 'react';
// import { ChartPQRSmonth } from './chartPQRSmonth';
// import { AnswerByuser } from './answerByuser';

function IndexResumen() {
  const { parameters } = Parameters();
  const [validateParam, setValidateParam] = useState(false);
  useEffect(() => {
    const validatorParameter = parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo === true);
    if (validatorParameter !== validateParam) {
      setValidateParam(validatorParameter);
    }
  }, [parameters, validateParam]);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={6} md={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Total de radicados con respuesta y sin respuesta</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <ChartArea />
        </MainCard>
      </Grid>

      <Grid item xs={6} md={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Total de radicados por estado</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <ChartEstados />
        </MainCard>
      </Grid>

      <Grid item xs={6} md={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Total respuestas por usuario</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <TableUsersAnswer />
        </MainCard>
      </Grid>

      {validateParam && (
        <Grid item xs={6} md={6}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Total porcentaje de PQRS sin responder</Typography>
            </Grid>
          </Grid>
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <ChartRadicadosAnswer />
          </MainCard>
        </Grid>
      )}

      <Grid item xs={6} md={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Total de asignaciones pendientes y respuestas por usuario</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <BarChart />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default IndexResumen;
