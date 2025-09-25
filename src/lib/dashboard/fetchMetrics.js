import axios from 'api/axios';

export const useFetchMetrics = () => {
  const fetchTotalPqrs = async () => {
    const { data } = await axios.get('/radicados/total-radicados');
    return data;
  };

  const fetchTotalEntities = async () => {
    const { data } = await axios.get('/entity/total/entity');
    return data;
  };

  const fetchTotalAnswers = async () => {
    const { data } = await axios.get('/radicados/total/quantity-answer');
    return data;
  };

  const fetchTotalAsiggned = async () => {
    const { data } = await axios.get('/radicados/radicados_asignados');
    return data;
  };

  const fetchTotalReturned = async () => {
    const { data } = await axios.get('/radicados/count-devueltos');
    return data;
  };

  const fetchTotalWithoutAssigned = async () => {
    const { data } = await axios.get('/radicados/radicados_sinasignar');
    return data;
  };

  const fetchTotalTypeAffair = async (id) => {
    const { data } = await axios.get(`/radicados/total/tutelas-incidentes/${id}`);
    return data;
  };

  const fetchTotalUnanswered = async () => {
    const { data } = await axios.get('/radicados/total/quantity-unanswered');
    return data;
  };

  return {
    fetchTotalPqrs,
    fetchTotalEntities,
    fetchTotalAnswers,
    fetchTotalAsiggned,
    fetchTotalReturned,
    fetchTotalWithoutAssigned,
    fetchTotalTypeAffair,
    fetchTotalUnanswered
  };
};
