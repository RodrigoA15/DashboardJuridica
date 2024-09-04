// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticPQRSCreadas from 'components/cards/statistics/AnalyticPQRSCreadas';

// assets
import AnalyticPQRSAsignadas from 'components/cards/statistics/AnalyticPQRSAsignadas';
import AnalyticPQRSRespondidas from 'components/cards/statistics/AnalyticPQRSRespondidas';
import AnalyticPQRSPendientes from 'components/cards/statistics/AnalyticPQRSPendientes';
import ChartEntidad from './ChartEntidad';
import RadicadosChart from './RadicadosChart';
import CanalEntradaChart from './CanalEntradaChart';
// import JsonToFileExcel from 'pages/components-overview/Radicados/JsonToXLSX';
import ChartDepartamentos from './ChartDepartamentos';
import AnalyticDesacatos from 'components/cards/statistics/AnalyticDesacatos';
import AnalyticTutelas from 'components/cards/statistics/AnalyticTutelas';
import AnalyticCourts from 'components/cards/statistics/AnalyticCourts';

// import RadicadosExcel from 'pages/components-overview/Radicados/radicadosExcel';
import IndexTipoAsunto from 'pages/components-overview/TipoAsunto/index';
import { Parameters } from 'hooks/useParameters';
import TablaVencidas from './TablaVencidas';
import { CreadasApi } from './creadasApi';
import { GraficaTipoAsunto } from './Tipo_asunto/GraficaTipo_asunto';
import { GraficaTAMes } from './Tipo_asunto/GraficaTAMes';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const { parameters } = Parameters();
  const { data } = CreadasApi();

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      {data.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.entidad}>
          <AnalyticPQRSCreadas description={item.entidad} value={item.count} />
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSPendientes />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSAsignadas />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSRespondidas />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticTutelas />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticDesacatos />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticCourts />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Respuestas por mes</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <RadicadosChart />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Radicados por área</Typography>
          </Grid>
          <Grid item />
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
          {parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo === true) ? (
            <GraficaTipoAsunto />
          ) : (
            <ChartDepartamentos />
          )}
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Entidad</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo === true) ? (
            <GraficaTAMes />
          ) : (
            <ChartEntidad />
          )}
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

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">PQRS vencidas</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <TablaVencidas />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Tipo asunto</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          {parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo === true) ? (
            <IndexTipoAsunto />
          ) : (
            <CanalEntradaChart />
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
