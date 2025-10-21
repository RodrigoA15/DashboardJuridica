import axios from 'api/axios';

export const useFetchAreas = () => {
  const fetchGetAreas = async () => {
    const { data } = await axios.get('/area');
    return data;
  };

  return {
    fetchGetAreas
  };
};
