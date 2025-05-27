import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'api/axios';
import chartsConfig from 'config/chart-config';

const BarChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },

      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },

      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: []
      },
      colors: ['#008FFB', '#00E396', '#FEB019']
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/assigned/allState-user');
        const data = response.data;

        const usernames = [];
        const estadosMap = {};

        data.map((item) => {
          if (!usernames.includes(item.nombre_usuario)) {
            usernames.push(item.nombre_usuario);
          }

          item.data.map((item2) => {
            if (!estadosMap[item2.estado_radicado]) {
              estadosMap[item2.estado_radicado] = Array(usernames.length).fill(0);
            }

            const userIndex = usernames.indexOf(item.nombre_usuario);
            estadosMap[item2.estado_radicado][userIndex] = item2.total;
          });
        });

        const series = Object.keys(estadosMap).map((estado) => ({
          name: estado,
          data: estadosMap[estado]
        }));

        setChartData({
          series,
          options: {
            ...chartsConfig,
            ...chartData.options,
            xaxis: {
              categories: usernames
            }
          }
        });
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="bar" />
    </div>
  );
};

export default BarChart;
