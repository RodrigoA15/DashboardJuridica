import axios from 'api/axios';
import { memo, useEffect, useState } from 'react';
import { Card } from '../Card';

export const AnalyticTotal = memo(() => {
  const [data, setData] = useState([]);

  useEffect(() => {
    totalPQRSApi();
  }, []);
  const totalPQRSApi = async () => {
    try {
      const response = await axios.get('/radicados/total-radicados');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dataClear = data.map((item) => item.count);

  return <Card color="card2" description="TOTAL PQRS" value={dataClear} />;
});
