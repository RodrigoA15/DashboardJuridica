import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

const AnalyticPQRSAsignadas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const apiDataAsignadas = async () => {
      try {
        const response = await axios.get('/radicados/radicados_asignados');
        const count = response.data.map((item) => item.count);
        setData(count);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error('No hay PQRS asignadas');
        } else {
          toast.error('Error en cantidad de asignaciones');
        }
      }
    };
    apiDataAsignadas();
  }, []);

  return (
    <>
      <Card description="SIN RESPUESTA" value={data} color="card3" />
    </>
  );
};

export default AnalyticPQRSAsignadas;
