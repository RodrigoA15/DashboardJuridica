import axios from 'api/axios';

export const useFetchAnswers = () => {
  const fetchAnswers = async (area_id) => {
    const { data } = await axios.get(`/answer/respuestasArea/${area_id}`);
    return data;
  };

  return {
    fetchAnswers
  };
};
