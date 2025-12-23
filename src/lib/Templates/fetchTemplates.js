import axios from 'api/axios';

export const useFetchTemplates = () => {
  const generateTemplateAudiences = async (payload) => {
    const response = await axios.post('/qx/generate-answer-audiences', { data: payload }, { responseType: 'blob' });
    return response.data;
  };

  return {
    generateTemplateAudiences
  };
};
