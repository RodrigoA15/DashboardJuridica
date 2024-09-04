import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';
export const ApiAsunto = () => {
  const [data, setData] = useState([]);
  const [dataMes, setDataMes] = useState([]);

  useEffect(() => {
    getTipoAsuntos();
    getTipoAsuntosMes();
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

  const getTipoAsuntosMes = useMemo(
    () => async () => {
      try {
        const response = await axios.get('/typification/month');
        setDataMes(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    []
  );
  return { data, dataMes };
};
