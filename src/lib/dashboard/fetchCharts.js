import axios from 'api/axios';

export const useFetchCharts = () => {
  const fetchChartTypifications = async () => {
    const { data } = await axios.get('/typification/month');
    return data;
  };

  const fetchTotalPQRS = async () => {
    const { data } = await axios.get('/radicados/total/radicados-mes');
    return data;
  };

  const fetchTotalTypifications = async () => {
    const { data } = await axios.get('/typification/types');
    return data;
  };

  const fetchTotalAnswers = async () => {
    const { data } = await axios.get('/answer/answer-month');
    return data;
  };

  return {
    fetchChartTypifications,
    fetchTotalPQRS,
    fetchTotalTypifications,
    fetchTotalAnswers
  };
};
