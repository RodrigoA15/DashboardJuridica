import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material/index';
import axios from 'api/axios';

function AnalyticPQRSAsignadas() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiDataAsignadas();
    const time = setInterval(apiDataAsignadas, 5000);

    return () => clearInterval(time);
  }, []);

  const apiDataAsignadas = async () => {
    try {
      const response = await axios.get('/radicados/radicados_asignados');
      setCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          PQRS Asignadas
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
}

export default AnalyticPQRSAsignadas;
