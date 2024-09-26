import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Card } from '../Card';

export const AnalyticCantRespuestas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    respuestasPendientesApi();
  }, []);

  const respuestasPendientesApi = async () => {
    try {
      const response = await axios.get('/radicados/total/quantity-answer');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const newData = data.map((item) => item.count);
  return <Card value={newData} description="RESPUESTAS" color="card2" />;
};
