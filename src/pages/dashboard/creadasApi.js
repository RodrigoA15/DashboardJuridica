import { toast } from 'sonner';
import axios from 'api/axios';
import { useEffect, useState } from 'react';
export const CreadasApi = () => {
  const [data, setData] = useState([]);
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 0);
  const dateEndMonth = new Date();

  useEffect(() => {
    dataApi();
  }, []);

  const dataApi = async () => {
    try {
      const response = await axios.get(`/entity/entidadt/${dateFirstMonth}/${dateEndMonth}`);
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay PQRS creadas');
      } else {
        toast.error('Error en cantidad de PQRS creadas');
      }
    }
  };

  return { data };
};
