// material-ui
import { Grid, Stack, Typography } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import axios from 'api/axios';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const AnalyticPQRSCreadas = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    dataApi();

    const time = setInterval(dataApi, 30000);

    return () => clearInterval(time);
  }, []);

  const dataApi = async () => {
    try {
      const response = await axios.get('radicados/radicados');
      const countResponse = response.data.length;
      setCount(countResponse);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay PQRS creadas');
      } else {
        toast.error('Error en cantidad de PQRS creadas');
      }
    }
  };
  return (
    <MainCard contentSX={{ p: 2.25 }} className="card1">
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          PQRS Creadas
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h3" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
};
export default AnalyticPQRSCreadas;
