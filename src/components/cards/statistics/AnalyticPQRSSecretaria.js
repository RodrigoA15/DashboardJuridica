// material-ui
import { Grid, Stack, Typography } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import axios from 'api/axios';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const AnalyticPQRSSecretaria = () => {
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
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Setiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  const dataApi = async () => {
    try {
      const response = await axios.get(`/entidad/entidadt/${dateFirstMonth}/${dateEndMonth}`);
      const responseData = response.data[0]; // Acceder al primer objeto del array
      const movitCount = responseData.Secretaria; // Obtener el valor de 'Movit' del objeto
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
    <MainCard contentSX={{ p: 2.25 }} className="cardSecretaria">
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          PQRS creadas Secretaria - {meses[mesActual.getMonth()]}
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
  );
};

export default AnalyticPQRSSecretaria;
