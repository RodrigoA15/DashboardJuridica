import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

function AnalyticPQRSPendientes() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    allRadicadosPendientes();
  }, []);

  const allRadicadosPendientes = async () => {
    try {
      const response = await axios.get('/radicados/radicados_sinasignar');
      const contador = response.data.length;
      setCount(contador);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados pendientes');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  return (
    <div>
      <Card description="PQRS sin asignar" value={count} color="card4" />
    </div>
  );
}

export default AnalyticPQRSPendientes;
