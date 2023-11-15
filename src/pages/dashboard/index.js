// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

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
import JsonToFileExcel from 'pages/components-overview/Radicados/JsonToXLSX';
import ChartDepartamentos from './ChartDepartamentos';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSCreadas />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSPendientes />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSAsignadas />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticPQRSRespondidas />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Radicados por mes</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <RadicadosChart />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Radicados por departamento</Typography>
          </Grid>
          <Grid item />
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
          <ChartDepartamentos />
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
          <ChartEntidad />
        </MainCard>
        <Grid item>
          <Typography variant="h5">Exportar Informacion Radicados </Typography>
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
            <JsonToFileExcel />
          </Stack>
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Canales de Entrada</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <CanalEntradaChart />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
