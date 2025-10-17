import axios from 'api/axios';

export const useFetchAssignments = () => {
  const fetchCreateAssignments = async (insertData) => {
    const { data } = await axios.post(`/assigned`, insertData);
    return data;
  };

  const fetchUpdateStatusRadicado = async (updateData) => {
    const { data } = await axios.put('/radicados', updateData);
    return data;
  };

  return {
    fetchCreateAssignments,
    fetchUpdateStatusRadicado
  };
};
