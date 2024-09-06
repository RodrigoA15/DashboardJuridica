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
        toast.error('No hay Desacatos');
      } else {
        toast.error('Error en cantidad de Desacatos');
      }
    }
  };

  const tutelas = data.filter((asuntos) => asuntos.tipo_asunto === '3');
  const countTutelas = tutelas.length;

  const alertDesacatos = () => {
    const dataDesacatos = tutelas.map((i) => `${i.numero_radicado} - ${i.estado_radicado}`);
    alert(dataDesacatos.join('\n'));
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className={countTutelas > 0 ? 'blinking' : 'card1'} onClick={() => alertDesacatos()}>
        <Stack spacing={0.5}>
          <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
            Desacatos
          </Typography>
          <Grid container alignItems="center">
            <Grid item style={{ margin: 'auto' }}>
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
