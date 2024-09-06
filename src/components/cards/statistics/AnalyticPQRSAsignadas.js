import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

function AnalyticPQRSAsignadas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiDataAsignadas();
  }, []);

  const apiDataAsignadas = async () => {
    try {
      const response = await axios.get('/radicados/radicados_asignados');
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay PQRS asignadas');
      } else {
        toast.error('Error en cantidad de asignaciones');
      }
    }
  };

  const count = data.map((item) => item.count);

  return (
    <>
      <Card description="PQRS asignadas" value={count} color="card3" />
    </>
  );
}

export default AnalyticPQRSAsignadas;
