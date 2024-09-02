import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { Card } from '../Card';

function AnalyticCourts() {
  const [courtData, setCourtData] = useState([]);

  useEffect(() => {
    apiDataCourt();
  }, []);

  const apiDataCourt = async () => {
    try {
      const response = await axios.get('/legal/countreqcourts');
      setCourtData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron peticiones por entidades juridicas');
      } else {
        toast.error('Error en contador entidades juridicas');
      }
    }
  };

  const count = courtData.map((item) => item.count);

  return (
    <>
      <Card value={count} description="PQRS Entidades Juridicas" color="card2" />
    </>
  );
}

export default AnalyticCourts;
