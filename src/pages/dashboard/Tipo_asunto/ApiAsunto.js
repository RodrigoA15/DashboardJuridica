import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
export const ApiAsunto = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTipoAsuntos();
  }, []);

  const getTipoAsuntos = useMemo(
    () => async () => {
      try {
        const response = await axios.get('/typification/types');
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return { data };
};
