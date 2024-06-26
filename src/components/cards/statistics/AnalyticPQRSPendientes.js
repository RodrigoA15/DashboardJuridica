import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';

function AnalyticPQRSPendientes() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    allRadicadosPendientes();
  }, []);

  const allRadicadosPendientes = async () => {
    try {
      const response = await axios.get('/radicados/radicados_sinasignar');
      const contador = response.data.length;
      setCount(contador);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados pendientes');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className="card4">
        <Stack spacing={0.5}>
          <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
            PQRS sin asignar
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
    </div>
  );
}

export default AnalyticPQRSPendientes;
