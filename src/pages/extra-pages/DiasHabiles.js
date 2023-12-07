// function DiasHabiles() {
//   let contador = 0;
//   let fechaInicio = new Date('2023-10-01');
//   let fechaFin = new Date();
//   let festivos = ['2023-10-06', '2023-10-05'];

//   while (fechaInicio <= fechaFin) {
//     const diaSemana = fechaInicio.getDay();
//     const fechaActual = fechaInicio.toISOString().split('T')[0];
//     const lunes = 1;
//     const viernes = 5;

//     if (diaSemana >= lunes && diaSemana <= viernes) {
//       if (!festivos.includes(fechaActual)) {
//         contador++;
//       }
//     }

//     fechaInicio.setDate(fechaInicio.getDate() + 1);
//   }

//   console.log('Días laborables:', contador);
// }

// export default DiasHabiles;
