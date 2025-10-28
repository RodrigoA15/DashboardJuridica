import axios from 'api/axios';

export const useFetchLegalEntities = () => {
  const fetchCreateLegal = async (sendData) => {
    const { data } = await axios.post('/legal', sendData);
    return data;
  };

  return {
    fetchCreateLegal
  };
};
