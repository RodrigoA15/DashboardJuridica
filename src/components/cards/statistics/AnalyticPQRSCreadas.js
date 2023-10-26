// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import axios from 'api/axios';
import { useEffect, useState } from 'react';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticPQRSCreadas = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    dataApi();

    const time = setInterval(dataApi, 5000);

    return () => clearInterval(time);
  }, []);

  const dataApi = async () => {
    try {
      const response = await axios.get('radicados/radicados');
      const countResponse = response.data.length;
      setCount(countResponse);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainCard contentSX={{ p: 2.25 }} className="card1">
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          PQRS Creadas
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
export default AnalyticPQRSCreadas;
