import axios from 'api/axios';

export const useFetchPendientes = () => {
  const fetchUsersByArea = async (id_area) => {
    const { data } = await axios.get(`/area/usuarios_departamento/${id_area}`);
    return data;
  };

  const fetchRadicadosByStatus = async (id_area) => {
    const { data } = await axios.get(`/radicados/pendientes/${id_area}`);
    return data;
  };

  const fetchActiveAreas = async () => {
    const { data } = await axios.get('/areas');
    return data;
  };

  const fetchUpdateRadicados = async (updateData) => {
    const { data } = await axios.put('/radicados/rm/reasignacion_departamento', updateData);
    return data;
  };

  return {
    fetchUsersByArea,
    fetchRadicadosByStatus,
    fetchActiveAreas,
    fetchUpdateRadicados
  };
};
