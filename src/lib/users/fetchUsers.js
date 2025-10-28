import axios from 'api/axios';

export const useFetchUsers = () => {
  const fetchGetUsers = async () => {
    const { data } = await axios.get('/usersQX');
    return data;
  };

  return {
    fetchGetUsers
  };
};
