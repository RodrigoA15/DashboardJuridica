import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

function AnalyticPQRSAsignadas() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiDataAsignadas();
  }, []);

  const apiDataAsignadas = async () => {
    try {
      const response = await axios.get('/radicados/radicados_asignados');
      setCount(response.data.length);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No hay PQRS asignadas');
      } else {
        toast.error('Error en cantidad de asignaciones');
      }
    }
  };

  return (
    <>
      <Card description="PQRS Asignadas" value={count} color="card3" />
    </>
  );
}

export default AnalyticPQRSAsignadas;
