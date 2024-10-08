import React, { memo, useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';

import { Card } from '../Card';
const AnalyticPQRSRespondidas = memo(() => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    apiCountRespondidos();
  }, []);

  const apiCountRespondidos = async () => {
    try {
      const response = await axios.get('/answer/total-answer');
      setAnswers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados respondidos');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  const count = answers.map((answer) => answer.count);

  return (
    <div>
      <Card description="PQRS CON RESPUESTA" value={count} color="card2" />
    </div>
  );
});

export default AnalyticPQRSRespondidas;
