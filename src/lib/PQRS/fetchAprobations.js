import axios from 'api/axios';

export const useFetchAprobations = () => {
  const fetchAprobationsStatus = async (status, id_departamento) => {
    const { data } = await axios.get(`/aprobations/status/${status}/${id_departamento}`);
    return data;
  };

  const fetchAssignAprobation = async (dataAprobation) => {
    const { data } = await axios.put(`/aprobations`, dataAprobation);
    return data;
  };

  const fetchCreateAprobation = async (dataAprobation) => {
    const { data } = await axios.post(`/aprobations`, dataAprobation);
    return data;
  };

  const fetchSearchAprobations = async (id_radicado, status) => {
    const { data } = await axios.get(`/aprobations/search/${id_radicado}/${status}`);
    return data;
  };

  const fetchAprobationsByUser = async (id) => {
    const { data } = await axios.get(`/aprobations/assign/${id}`);
    return data;
  };

  const fetchChangeAprobation = async (dataAprobation) => {
    const { data } = await axios.put(`/aprobations/reassignment`, dataAprobation);
    return data;
  };

  return {
    fetchAprobationsStatus,
    fetchAssignAprobation,
    fetchCreateAprobation,
    fetchSearchAprobations,
    fetchAprobationsByUser,
    fetchChangeAprobation
  };
};
