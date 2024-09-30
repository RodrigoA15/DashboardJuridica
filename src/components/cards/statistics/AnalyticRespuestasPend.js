import { memo, useEffect, useState } from 'react';
import axios from 'api/axios';
import { Card } from '../Card';

export const AnalyticRespuestasPend = memo(() => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const respuestasPendientesApi = async () => {
      try {
        const response = await axios.get('/radicados/total/quantity-unanswered');
        const newData = response.data.map((item) => item.count);
        setData(newData);
      } catch (error) {
        setData([]);
      }
    };

    respuestasPendientesApi();
  }, []);

  return <Card value={data} description="RESPUESTAS POR DAR" color="card2" />;
});
