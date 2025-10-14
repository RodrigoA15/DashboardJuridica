// import { useEffect, useState } from 'react';
// // material-ui
// import { Grid, Typography, CircularProgress, Box } from '@mui/material';
// // project import
// import MainCard from 'components/MainCard';
// import AnalyticPQRSCreadas from 'components/cards/statistics/AnalyticPQRSCreadas';
// // assets
// import AnalyticPQRSAsignadas from 'components/cards/statistics/AnalyticPQRSAsignadas';
// import AnalyticPQRSPendientes from 'components/cards/statistics/AnalyticPQRSPendientes';
// import { RadicadosChart } from './RadicadosChart';
// import { CanalEntradaChart } from './CanalEntradaChart';
// // import JsonToFileExcel from 'pages/components-overview/Radicados/JsonToXLSX';
// import AnalyticDesacatos from 'components/cards/statistics/AnalyticDesacatos';
// import AnalyticTutelas from 'components/cards/statistics/AnalyticTutelas';
// import { AnalyticRespuestasPend } from 'components/cards/statistics/AnalyticRespuestasPend';
// // import RadicadosExcel from 'pages/components-overview/Radicados/radicadosExcel';
import IndexTipoAsunto from 'pages/components-overview/TipoAsunto/index';
// import { useParameters } from 'hooks/useParameters';
// import { AnalyticTotal } from 'components/cards/statistics/AnalyticTotal';
// import { AnalyticDevueltos } from 'components/cards/statistics/AnalyticDevueltos';
// import { AnalyticCantRespuestas } from 'components/cards/statistics/AnalyticCantRespuestas';
// import GraficaTAMes from './Tipo_asunto/GraficaTAMes';
// import ChartEntidad from './ChartEntidad';
// import GraficaTipoAsunto from './Tipo_asunto/GraficaTipo_asunto';
// import ChartRadicadosAnswer from './ChartRadicadosAnswer';
import { ChartTotalPQRS } from './Charts/ChartTotalPQRS';
import { ChartTotalTypification } from './Charts/ChartTotalMonthTypification';
import { MetricsDashboard } from './Metrics/MetricsDashboard';
import { ChartTotalTypifications } from './Charts/ChartTotalTypifications';
import { ChartTotalPQRSAnswers } from './Charts/ChartTotalPQRSAnswers';
import { TabVencidas } from './Tables/index';
// ==============================|| DASHBOARD - DEFAULT ||============================== //
const DashboardDefault = () => {
  // const { parameters, loading } = useParameters();
  // const [validateParam, setValidateParam] = useState(false);

  // useEffect(() => {
  //   if (!loading) {
  //     const validatorParameter = parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo);
  //     setValidateParam(validatorParameter);
  //   }
  // }, [parameters, loading]);

  // if (loading) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    // <Grid container rowSpacing={4.5} columnSpacing={2.75}>
    //   <Grid item xs={12} sx={{ mb: -2.25 }}>
    //     <Typography variant="h5">Dashboard</Typography>
    //   </Grid>

    //   <Grid item xs={12} sm={6} md={4} lg={2}>
    //     <AnalyticTotal />
    //   </Grid>
    //   <Grid item xs={12} sm={6} md={4} lg={2}>
    //     <AnalyticPQRSCreadas />
    //   </Grid>

    //   <Grid item xs={12} sm={6} md={4} lg={2}>
    //     <AnalyticCantRespuestas />
    //   </Grid>
    //   <Grid item xs={12} sm={6} md={10} lg={2}>
    //     <AnalyticPQRSAsignadas />
    //   </Grid>
    //   <Grid item xs={12} sm={6} md={10} lg={2}>
    //     <AnalyticPQRSPendientes />
    //   </Grid>

    //   {validateParam && (
    //     <Grid item xs={12} sm={6} md={4} lg={3}>
    //       <AnalyticDevueltos />
    //     </Grid>
    //   )}

    //   <Grid item xs={12} sm={6} md={4} lg={3}>
    //     <AnalyticTutelas />
    //   </Grid>

    //   <Grid item xs={12} sm={6} md={4} lg={3}>
    //     <AnalyticDesacatos />
    //   </Grid>

    //   <Grid item xs={12} sm={6} md={4} lg={3}>
    //     <AnalyticRespuestasPend />
    //   </Grid>

    //   <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

    //   {/* row 1 */}
    //   <Grid item xs={12} md={5} lg={4}>
    //     <Grid container alignItems="center" justifyContent="space-between">
    //       <Grid item>
    //         <Typography variant="h5">{validateParam ? 'PQRS y Tutelas por mes' : 'Entidades'}</Typography>
    //       </Grid>
    //       <Grid item />
    //     </Grid>
    //     <MainCard sx={{ mt: 2 }} content={false}>
    //       {validateParam ? <GraficaTAMes /> : <ChartEntidad />}
    //     </MainCard>
    //   </Grid>

    //   {/* row 2 */}
    //   <Grid item xs={12} md={7} lg={4}>
    //     <Grid container alignItems="center" justifyContent="space-between">
    //       <Grid item>
    //         <Typography variant="h5">Total peticiones por mes</Typography>
    //       </Grid>
    //     </Grid>
    //     <MainCard content={false} sx={{ mt: 2 }}>
    //       <RadicadosChart />
    //     </MainCard>
    //   </Grid>

    //   <Grid item xs={12} md={5} lg={4}>
    //     <Grid container alignItems="center" justifyContent="space-between">
    //       <Grid item>
    //         <Typography variant="h5">{validateParam ? 'Total PQRS y Tutelas' : 'Radicados y respuestas por mes'}</Typography>
    //       </Grid>
    //       <Grid item />
    //     </Grid>

    //     <MainCard sx={{ mt: 2 }} content={false}>
    //       {validateParam ? <GraficaTipoAsunto /> : <ChartRadicadosAnswer />}
    //     </MainCard>
    //   </Grid>

    //   <Grid item xs={12} md={7} lg={8}>
    //     <Grid container alignItems="center" justifyContent="space-between">
    //       <Grid item>
    //         <Typography variant="h5">PQRS vencidas</Typography>
    //       </Grid>
    //       <Grid item />
    //     </Grid>
    //     <MainCard content={false} sx={{ mt: 1.5 }}>
    //       <TabVencidas />
    //     </MainCard>
    //   </Grid>

    //   {/* row 4 */}
    //   <Grid item xs={12} md={5} lg={4}>
    //     <Grid container alignItems="center" justifyContent="space-between">
    //       <Grid item>
    //         <Typography variant="h5">{validateParam ? 'Total asuntos' : 'Canal entrada'}</Typography>
    //       </Grid>
    //     </Grid>
    //     <MainCard sx={{ mt: 1.75 }}>{validateParam ? <IndexTipoAsunto /> : <CanalEntradaChart />}</MainCard>
    //   </Grid>
    // </Grid>
    <div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <MetricsDashboard />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <ChartTotalTypification />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <ChartTotalPQRS />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <ChartTotalTypifications />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <ChartTotalPQRSAnswers />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-4">
        <div className="space-y-6 lg:col-span-2">
          <TabVencidas />
        </div>
        <div className="lg:col-span-1">
          <IndexTipoAsunto />
        </div>
      </div>
    </div>
  );
};

export default DashboardDefault;
