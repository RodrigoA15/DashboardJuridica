import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';

function AnalyticPQRSRespondidas() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiCountRespondidos();
  }, []);

  const apiCountRespondidos = async () => {
    try {
      const response = await axios.get('/radicados/radicado_respuestas');
      const contador = response.data.length;
      setCount(contador);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados respondidos');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

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
