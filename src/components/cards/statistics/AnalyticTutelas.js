import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';

const AnalyticTutelas = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiAsuntos();
  }, []);

  const apiAsuntos = async () => {
    try {
      const response = await axios.get('/radicados/chartasuntos');
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status != 404) {
        setError(error.response.data);
      } else {
        toast.success('No hay tutelas');
      }
    }
  };

  const countTutelas = data.filter((asuntos) => asuntos.tipo_asunto === '2');
  const dataTutelas = countTutelas.length;

  const alertTutelas = () => {
    const dataDesacatos = countTutelas.map((i) => `${i.numero_radicado} - ${i.estado_radicado}`);
    alert(dataDesacatos.join('\n'));
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className={dataTutelas > 0 ? 'blinking' : 'cardTutelas'} onClick={() => alertTutelas()}>
        <Stack spacing={0.5}>
          <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
            Tutelas
          </Typography>
          <Grid container alignItems="center">
            {error ? (
              <Grid item>{error}</Grid>
            ) : (
              <Grid item style={{ margin: 'auto' }}>
                <Typography variant="h3" color="inherit">
                  {dataTutelas}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Stack>
      </MainCard>
    </div>
  );
};

export default AnalyticTutelas;
