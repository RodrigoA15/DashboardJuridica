const useDiasHabiles = () => {
  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let festivos = ['2024-03-25', '2024-03-28', '2024-03-29'];
    let fechaInicio = new Date(fecha_radicado);
    let fechaCalculo = new Date(fechaInicio);
    fechaCalculo.setDate(fechaCalculo.getDate() + 1);
    let fechaFin = new Date();

    while (fechaCalculo <= fechaFin) {
      const diaSemana = fechaCalculo.getDay();

      if (diaSemana !== 5 && diaSemana !== 6 && !festivos.includes(fechaCalculo.toISOString().slice(0, 10))) {
        contador++;
      }

      fechaCalculo.setDate(fechaCalculo.getDate() + 1);
    }
    return contador;
  };
  return { diasHabiles };
};

export default useDiasHabiles;
