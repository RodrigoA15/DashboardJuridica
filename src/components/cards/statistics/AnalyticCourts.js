import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import { meses } from 'data/meses';
function AnalyticCourts() {
  const [courtData, setCourtData] = useState([]);

  useEffect(() => {
    apiDataCourt();
  }, []);

  const apiDataCourt = async () => {
    try {
      const response = await axios.get('/countreqcourts');
      setCourtData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron peticiones por entidades juridicas');
      } else {
        toast.error('Error en contador entidades juridicas');
      }
    }
  };

  const mesActual = new Date();
  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <MainCard contentSX={{ p: 2.25 }} className="cardEntidad">
        <Stack spacing={0.5}>
          <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
            PQRS Entidades Juridicas - {meses[mesActual.getMonth()]}
          </Typography>
          <Grid container alignItems="center">
            <Grid item style={{ margin: 'auto' }}>
              <Typography variant="h3" color="inherit">
                {courtData.map((count) => count.count)}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </div>
  );
}

export default AnalyticCourts;
