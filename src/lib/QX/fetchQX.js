import axios from 'api/axios';

export const useFetchQX = () => {
  const searchUserIdAudiences = async (id) => {
    const response = await axios.post('/qx/search-user', { userId: id });
    return response.data;
  };

  return {
    searchUserIdAudiences
  };
};
