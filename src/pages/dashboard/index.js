// material-ui
import { Grid, Typography } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import AnalyticPQRSCreadas from 'components/cards/statistics/AnalyticPQRSCreadas';
// assets
import AnalyticPQRSAsignadas from 'components/cards/statistics/AnalyticPQRSAsignadas';
import AnalyticPQRSRespondidas from 'components/cards/statistics/AnalyticPQRSRespondidas';
import AnalyticPQRSPendientes from 'components/cards/statistics/AnalyticPQRSPendientes';
import { RadicadosChart } from './RadicadosChart';
import { CanalEntradaChart } from './CanalEntradaChart';
// import JsonToFileExcel from 'pages/components-overview/Radicados/JsonToXLSX';
import AnalyticDesacatos from 'components/cards/statistics/AnalyticDesacatos';
import AnalyticTutelas from 'components/cards/statistics/AnalyticTutelas';
import { AnalyticRespuestasPend } from 'components/cards/statistics/AnalyticRespuestasPend';
// import RadicadosExcel from 'pages/components-overview/Radicados/radicadosExcel';
import IndexTipoAsunto from 'pages/components-overview/TipoAsunto/index';
import { Parameters } from 'hooks/useParameters';
import { CreadasApi } from './creadasApi';
import { AnalyticTotal } from 'components/cards/statistics/AnalyticTotal';
import { AnalyticDevueltos } from 'components/cards/statistics/AnalyticDevueltos';
import { AnalyticCantRespuestas } from 'components/cards/statistics/AnalyticCantRespuestas';
import { lazy, Suspense, useEffect, useState } from 'react';
import { TabVencidas } from './vencidas/index';
const GraficaTAMes = lazy(() => import('./Tipo_asunto/GraficaTAMes'));
const ChartEntidad = lazy(() => import('./ChartEntidad'));
const GraficaTipoAsunto = lazy(() => import('./Tipo_asunto/GraficaTipo_asunto'));
const ChartRadicadosAnswer = lazy(() => import('./ChartRadicadosAnswer'));
// ==============================|| DASHBOARD - DEFAULT ||============================== //
const DashboardDefault = () => {
  const { parameters } = Parameters();
  const { data } = CreadasApi();
  const [validateParam, setValidateParam] = useState(false);
  useEffect(() => {
    const validatorParameter = parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo === true);
    if (validatorParameter !== validateParam) {
      setValidateParam(validatorParameter);
    }
  }, [parameters, validateParam]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid item xs={6} sm={3} md={2} lg={2}>
        <AnalyticTotal />
      </Grid>
      {data.map((item) => (
        <Grid item xs={6} sm={3} md={2} lg={2} key={item.entidad}>
          <AnalyticPQRSCreadas description={item.entidad} value={item.count} />
        </Grid>
      ))}
      <Grid item xs={6} sm={3} md={2} lg={2}>
        <AnalyticPQRSRespondidas />
      </Grid>
      <Grid item xs={6} sm={3} md={2} lg={2}>
        <AnalyticPQRSAsignadas />
      </Grid>
      <Grid item xs={6} sm={3} md={2} lg={2}>
        <AnalyticPQRSPendientes />
      </Grid>

      {validateParam && (
        <Grid item xs={6} sm={3} md={2} lg={2}>
          <AnalyticDevueltos />
        </Grid>
      )}

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticTutelas />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticDesacatos />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticRespuestasPend />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticCantRespuestas />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 1 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Entidades</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Suspense fallback={<div>Cargando...</div>}>{validateParam ? <GraficaTAMes /> : <ChartEntidad />}</Suspense>
        </MainCard>
        {/* <Grid item>
          <Typography variant="h5">Exportar informacion radicados </Typography>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Exportar Datos
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <div className="row m-3">
              <div className="col-6">
                <JsonToFileExcel />
              </div>
              <div className="col-6">
                <RadicadosExcel />
              </div>
            </div>
          </Stack>
        </MainCard> */}
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Cantidad PQRS</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 2 }}>
          <RadicadosChart />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Radicados y respuestas por mes</Typography>
          </Grid>
          <Grid item />
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
          <Suspense fallback={<div>Cargando...</div>}> {validateParam ? <GraficaTipoAsunto /> : <ChartRadicadosAnswer />}</Suspense>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">PQRS vencidas</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <TabVencidas />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Canal entrada</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <Suspense fallback={<div>Cargando...</div>}>{validateParam ? <IndexTipoAsunto /> : <CanalEntradaChart />}</Suspense>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
