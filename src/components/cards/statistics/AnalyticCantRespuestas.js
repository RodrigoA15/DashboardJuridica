import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Card } from '../Card';

export const AnalyticCantRespuestas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const respuestasPendientesApi = async () => {
      try {
        const response = await axios.get('/radicados/total/quantity-answer');
        const newData = response.data.map((item) => item.count);
        setData(newData);
      } catch (error) {
        console.log(error);
      }
    };
    respuestasPendientesApi();
  }, []);

  return <Card value={data} description="RESPUESTAS" color="card2" />;
};
