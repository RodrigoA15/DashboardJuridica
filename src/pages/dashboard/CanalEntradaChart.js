import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'api/axios';

export const CanalEntradaChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    dataCanalApi();
  }, []);

  const dataCanalApi = async () => {
    try {
      const response = await axios.get('/radicados/chart-canal');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const categories = data.map((item) => item._id.mes);
  const canales = [...new Set(data.flatMap((item) => item.canales.map((canal) => canal.canal)))];

  const series = canales.map((canal) => {
    return {
      name: canal,
      data: data.map((item) => {
        const canalData = item.canales.find((c) => c.canal === canal);
        return canalData ? canalData.count : 0;
      })
    };
  });

  const chartData = {
    type: 'bar',
    series: series,
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: categories // Los meses como categorías
      },
      yaxis: {
        title: {
          text: 'Número de radicados'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${val} radicados`;
          }
        }
      }
    }
  };

  return <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />;
};
