import { meses } from 'data/meses';
import { ApiAsunto } from './ApiAsunto';
import Chart from 'react-apexcharts';

const GraficaTAMes = () => {
  const { dataMes } = ApiAsunto();

  const uniqueMonths = [...new Set(dataMes.map((item) => item._id))];

  const pqrsData = uniqueMonths.map((month) => {
    const entry = dataMes.find((item) => item._id === month && item.nombre_tipificacion === 'PQRS');
    return entry ? entry.count : 0;
  });

  const tutelasData = uniqueMonths.map((month) => {
    const entry = dataMes.find((item) => item._id === month && item.nombre_tipificacion === 'TUTELAS');
    return entry ? entry.count : 0;
  });
  const chartData = {
    series: [
      {
        name: 'PQRS',
        type: 'bar',
        data: pqrsData
      },
      {
        name: 'TUTELAS',
        type: 'line',
        data: tutelasData
      }
    ],

    options: {
      colors: ['#0288d1', '#C40C0C'],
      plotOptions: {
        bar: {
          borderRadius: 6
        },
        dataLabels: {
          position: 'top'
        }
      },

      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },

      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 5
      },
      xaxis: {
        categories: uniqueMonths.map((item) => meses[item - 1])
      }
    }
  };

  return (
    <>
      <Chart {...chartData} />
    </>
  );
};

export default GraficaTAMes;
