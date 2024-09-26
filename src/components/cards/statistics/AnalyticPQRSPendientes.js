import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

function AnalyticPQRSPendientes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    allRadicadosPendientes();
  }, []);

  const allRadicadosPendientes = async () => {
    try {
      const response = await axios.get('/radicados/radicados_sinasignar');
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados pendientes');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  const count = data.map((item) => item.count);

  return (
    <div>
      <Card description="SIN ASIGNAR" value={count} color="card4" />
    </div>
  );
}

export default AnalyticPQRSPendientes;
