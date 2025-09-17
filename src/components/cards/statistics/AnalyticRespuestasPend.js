import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Card } from '../Card';

export const AnalyticRespuestasPend = () => {
  const [data, setData] = useState([]);
  const respuestasPendientesApi = async () => {
    try {
      const response = await axios.get('/radicados/total/quantity-unanswered');
      const newData = response.data.map((item) => item.count);
      setData(newData);
    } catch (error) {
      setData([]);
    }
  };

  useEffect(() => {
    respuestasPendientesApi();
  }, []);

  return <Card value={data} description="PENDIENTE RESPUESTA" color="card2" />;
};
