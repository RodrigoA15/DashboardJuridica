import axios from 'api/axios';

export const useFetchProductivity = () => {
  const monthlyProductivity = async (fechaInicio, fechaFin) => {
    const { data } = await axios.get(`/radicados/capacidad-juridica-mes/${fechaInicio}/${fechaFin}`);
    return data;
  };

  const userProductivity = async (fechaInicio, fechaFin) => {
    const { data } = await axios.get(`/radicados/capacidad-juridica-usuarios/${fechaInicio}/${fechaFin}`);
    return data;
  };

  const answersProductivity = async (fechaInicio, fechaFin) => {
    const { data } = await axios.get(`/radicados/capacidad-juridica-respuestas/${fechaInicio}/${fechaFin}`);
    return data;
  };

  const projections = async (fechaInicio, fechaFin, promedio_respuesta, tipificacion, meta, dias_laborales) => {
    const { data } = await axios.get('/radicados/capacidad-juridica-proyecciones', {
      params: {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        promedio_respuesta,
        tipificacion,
        meta,
        dias_laborales
      }
    });

    return data;
  };

  return {
    monthlyProductivity,
    userProductivity,
    answersProductivity,
    projections
  };
};
