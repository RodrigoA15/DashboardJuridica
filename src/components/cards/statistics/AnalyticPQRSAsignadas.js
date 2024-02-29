import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material/index';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';

function AnalyticPQRSAsignadas() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiDataAsignadas();
    const time = setInterval(apiDataAsignadas, 30000);

    return () => clearInterval(time);
  }, []);

  const apiDataAsignadas = async () => {
    try {
      const response = await axios.get('/radicados/radicados_asignados');
      setCount(response.data.length);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay PQRS asignadas');
      } else {
        toast.error('Error en cantidad de asignaciones');
      }
    }
  };
  return (
    <MainCard contentSX={{ p: 2.25 }} className="card3">
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <Stack spacing={0.5}>
        <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
          PQRS Asignadas
        </Typography>
        <Grid container alignItems="center">
          <Grid item style={{ margin: 'auto' }}>
            <Typography variant="h3" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
}

export default AnalyticPQRSAsignadas;
