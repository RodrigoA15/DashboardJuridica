import { ApiAsunto } from './ApiAsunto';
import Chart from 'react-apexcharts';
export const GraficaTipoAsunto = () => {
  const { data } = ApiAsunto();

  const chartData = {
    type: 'donut',
    series: data.map((item) => item.count),
    options: {
      labels: data.map((item) => item.nombre_tipificacion),
      chart: {
        width: 200
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '16px',
          colors: ['#000']
        },
        dropShadow: {
          enabled: false
        }
      },
      legend: {
        position: 'bottom'
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                }
              }
            }
          }
        }
      }
    }
  };

  return (
    <>
      <Chart {...chartData} />
    </>
  );
};
