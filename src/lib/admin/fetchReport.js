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

  const generateReportDocx = async ({ startDate, endDate }) => {
    const response = await axios.post(
      'http://localhost:4000/api/v2/qx/generate-report-atlantico',
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
    generateReport,
    generateReportDocx
  };
};
