import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';

function AnalyticPQRSRespondidas() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiCountRespondidos();

    const time = setInterval(apiCountRespondidos, 30000);

    return () => clearInterval(time);
  }, []);

  const apiCountRespondidos = async () => {
    try {
      const response = await axios.get('/radicados/radicado_respuestas');
      const contador = response.data.length;
      setCount(contador);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <MainCard contentSX={{ p: 2.25 }} className="card2">
        <Stack spacing={0.5}>
          <Typography variant="h6" color="textSecondary">
            PQRS Respondidas
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
    </div>
  );
}

export default AnalyticPQRSRespondidas;
