const useDiasHabiles = () => {
  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let festivos = [
      '2024-03-25',
      '2024-03-28',
      '2024-03-29',
      '2024-06-03',
      '2024-06-10',
      '2024-07-01',
      '2024-07-20',
      '2024-08-19',
      '2024-10-14',
      '2024-11-04',
      '2024-12-08',
      '2024-12-25'
    ];
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
