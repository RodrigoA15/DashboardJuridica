const useDiasHabiles = () => {
  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let festivos = [
      "2026-01-01", // Año Nuevo
      "2026-01-12", // Reyes Magos (del 6 de enero)
      "2026-03-23", // Día de San José (del 19 de marzo)
      "2026-04-02", // Jueves Santo
      "2026-04-03", // Viernes Santo
      "2026-05-01", // Día del Trabajo
      "2026-05-18", // Día de la Ascensión (del 14 de mayo)
      "2026-06-08", // Corpus Christi (del 4 de junio)
      "2026-06-15", // Sagrado Corazón (del 12 de junio)
      "2026-06-29", // San Pedro y San Pablo
      "2026-07-13", // Dia de la virgen de chiquinquirá
      "2026-07-20", // Día de la Independencia
      "2026-08-07", // Batalla de Boyacá
      "2026-08-17", // La Asunción de la Virgen (del 15 de agosto)
      "2026-10-12", // Día de la Raza
      "2026-11-02", // Todos los Santos (del 1 de noviembre)
      "2026-11-16", // Independencia de Cartagena (del 11 de noviembre)
      "2026-12-08", // Inmaculada Concepción
      "2026-12-25", // Navidad
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
