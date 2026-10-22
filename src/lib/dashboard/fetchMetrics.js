import axios from 'api/axios';

export const useFetchMetrics = () => {
  const fetchAllMetrics = async () => {
    const { data } = await axios.get(`/metrics`);
    return data;
  };

  return {
    fetchAllMetrics
  };
};
