// material-ui
import { Grid, Stack, Typography } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import axios from 'api/axios';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { meses } from 'data/meses';
const AnalyticPQRSCreadas = () => {
  const [count, setCount] = useState(0);
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 0);
  const dateEndMonth = new Date();

  useEffect(() => {
    dataApi();

    const time = setInterval(dataApi, 30000);

    return () => clearInterval(time);
  }, []);

  const mesActual = new Date();

  const dataApi = async () => {
    try {
      const response = await axios.get(`/entity/entidadt/${dateFirstMonth}/${dateEndMonth}`);
      const responseData = response.data[0]; // Acceder al primer objeto del array
      const movitCount = responseData.Movit; // Obtener el valor de 'Movit' del objeto
      setCount(movitCount); // Actualizar el estado 'count'
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay PQRS creadas');
      } else {
        toast.error('Error en cantidad de PQRS creadas');
      }
    }
  };

  return (
    <MainCard contentSX={{ p: 2.25 }} className="card1">
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <Stack spacing={0.5}>
        <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
          PQRS creadas concesión tránsito - {meses[mesActual.getMonth()]}
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
  );
};

export default AnalyticPQRSCreadas;
