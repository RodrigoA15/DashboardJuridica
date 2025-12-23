// import axios from "api/axios" -> Prefix endPoint
import axios from 'axios';

export const useFetchReport = () => {
  const generateReport = async ({ startDate, endDate }) => {
    const response = await axios.post(
      'http://localhost:5678/webhook/report_pqrs',
      {
        startDate,
        endDate
      },
      {
        responseType: 'blob'
      }
    );

    return response;
  };

  return {
    generateReport
  };
};
