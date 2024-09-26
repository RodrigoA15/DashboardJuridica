import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'api/axios';

export const ChartEntidad = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    totalEntytiApi();
  }, []);

  const totalEntytiApi = async () => {
    try {
      const response = await axios.get('/entity/total/entity');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = {
    type: 'donut',
    series: data.map((item) => item.count),
    options: {
      labels: data.map((item) => item.entidad),
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
      colors: ['#4379F2', '#FF1E1E', '#2196f3', '#03a9f4', '#ff9800', '#f44336'],

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
  return <Chart {...chartData} />;
};
