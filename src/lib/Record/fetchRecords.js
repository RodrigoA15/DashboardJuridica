import axios from 'api/axios';

export const useFetchRecords = () => {
  const fetchInsertRecord = async (record) => {
    const { data } = await axios.post('/history', record);
    return data;
  };

  return {
    fetchInsertRecord
  };
};
