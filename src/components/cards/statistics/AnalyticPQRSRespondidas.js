import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { meses } from 'data/meses';
function AnalyticPQRSRespondidas() {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    apiCountRespondidos();
  }, []);

  const apiCountRespondidos = async () => {
    try {
      const response = await axios.get('/answer/answer_month');
      setAnswers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados respondidos');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  const mes = new Date().getMonth();
  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className="card2">
        <Stack spacing={0.5}>
          <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
            PQRS Respondidas - {meses[mes]}
          </Typography>
          <Grid container alignItems="center">
            <Grid item style={{ margin: 'auto' }}>
              <Typography variant="h3" color="inherit">
                {answers.map((answer) => answer.count)}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </div>
  );
}

export default AnalyticPQRSRespondidas;
