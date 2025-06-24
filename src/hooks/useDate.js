const useDiasHabiles = () => {
  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let festivos = [
      '2025-06-02',
      '2025-06-23',
      '2025-06-30',
      '2025-08-07',
      '2025-08-18',
      '2025-10-13',
      '2025-11-17',
      '2025-12-08',
      '2025-12-25'
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
