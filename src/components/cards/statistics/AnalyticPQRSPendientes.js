import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';

function AnalyticPQRSPendientes() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    allRadicadosPendientes();
    const time = setInterval(allRadicadosPendientes, 5000);

    return () => clearInterval(time);
  }, []);

  const allRadicadosPendientes = async () => {
    try {
      const response = await axios.get('/radicados/radicados_pendientes');
      const contador = response.data.length;
      setCount(contador);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <MainCard contentSX={{ p: 2.25 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="textSecondary">
            PQRS Pendientes
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
    </div>
  );
}

export default AnalyticPQRSPendientes;
