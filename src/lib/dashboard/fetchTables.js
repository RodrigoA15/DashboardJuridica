import axios from 'api/axios';
export const useFetchTables = () => {
  const fetchPQRSExpired = async () => {
    const { data } = await axios.get('/radicados/vencidas');
    return data;
  };

  return {
    fetchPQRSExpired
  };
};
