import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

const AnalyticPQRSPendientes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const allRadicadosPendientes = async () => {
      try {
        const response = await axios.get('/radicados/radicados_sinasignar');
        const count = response.data.map((item) => item.count);
        setData(count);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error('No se encontraron radicados pendientes');
        } else {
          toast.error('No se pudo cargar la información', { description: 'error de servidor' });
        }
      }
    };
    allRadicadosPendientes();
  }, []);

  return (
    <div>
      <Card description="POR ASIGNAR" value={data} color="card4" />
    </div>
  );
};

export default AnalyticPQRSPendientes;
