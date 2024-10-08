import { memo, useEffect, useState } from 'react';
import { Card } from '../Card';
import axios from 'api/axios';
export const AnalyticDevueltos = memo(() => {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiDataDevueltos();
  }, []);

  const apiDataDevueltos = async () => {
    try {
      const response = await axios.get('/radicados/count-devueltos');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const count = data.map((item) => item.count);

  return (
    <>
      <Card description="PQRS devueltas" value={count} color="card3" />
    </>
  );
});
