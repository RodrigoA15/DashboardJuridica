import axios from 'api/axios';

export const useFetchAnswers = () => {
  const fetchAnswers = async (area_id) => {
    const { data } = await axios.get(`/answer/respuestasArea/${area_id}`);
    return data;
  };

  const fetchTypeSignature = async (assignment_id, requires_signature, signature_status) => {
    const { data } = await axios.get(`/answer/type-signatures/${assignment_id}/${requires_signature}/${signature_status}`);
    return data;
  };

  const fetchSignaturesByStatus = async (assignment_id, requires_signature, signature_status) => {
    const { data } = await axios.get(`/answer/signature-by-status/${assignment_id}/${requires_signature}/${signature_status}`);
    return data;
  };

  const fetchUpdateAnswerSignature = async (assignment_id, payload) => {
    const { data } = await axios.put(`/answer/update-answer-signature/${assignment_id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  };

  return {
    fetchAnswers,
    fetchTypeSignature,
    fetchSignaturesByStatus,
    fetchUpdateAnswerSignature
  };
};
