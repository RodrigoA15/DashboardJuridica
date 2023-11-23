import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';

function AnalyticDesacatos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiAsuntos();
  }, []);

  const apiAsuntos = async () => {
    try {
      const response = await axios.get('/radicados/chartasuntos');
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay tutelas');
      } else {
        toast.error('Error de servidor');
      }
    }
  };

  const countTutelas = data.filter((asuntos) => asuntos.id_asunto.tipo_asunto === '3').length;

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className={countTutelas > 0 ? 'blinking' : 'card2'}>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="textSecondary">
            Desacatos
          </Typography>
          <Grid container alignItems="center">
            <Grid item>
              <Typography variant="h3" color="inherit">
                {countTutelas}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </div>
  );
}

export default AnalyticDesacatos;
