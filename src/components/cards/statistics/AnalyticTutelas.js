import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';

function AnalyticTutelas() {
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

  const countTutelas = data.filter((asuntos) => asuntos.id_asunto.tipo_asunto === '2').length;
  const dataTutelas = data.filter((asuntos) => asuntos.id_asunto.tipo_asunto === '2');

  const alertTutelas = async () => {
    const dataDesacatos = dataTutelas.map((i) => {
      return i.numero_radicado;
    });

    alert(dataDesacatos);
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className={countTutelas > 0 ? 'blinking' : 'card2'} onClick={() => alertTutelas()}>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="textSecondary">
            Tutelas
          </Typography>
          <Grid container alignItems="center">
            {error ? (
              <Grid item>{error}</Grid>
            ) : (
              <Grid item>
                <Typography variant="h3" color="inherit">
                  {countTutelas}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Stack>
      </MainCard>
    </div>
  );
}

export default AnalyticTutelas;
