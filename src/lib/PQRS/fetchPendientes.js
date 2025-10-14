import axios from 'api/axios';

export const useFetchPendientes = () => {
  const fetchUsersByArea = async (id_area) => {
    const { data } = await axios.get(`/area/usuarios_departamento/${id_area}`);
    return data;
  };

  return {
    fetchUsersByArea
  };
};
