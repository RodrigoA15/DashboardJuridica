import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'api/axios';
import { meses } from 'data/meses';

export const RadicadosChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    totalRadicadosApi();
  }, []);

  const totalRadicadosApi = async () => {
    try {
      const response = await axios.get('/radicados/total/radicados-mes');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = {
    type: 'line',
    series: [
      {
        name: 'Total Radicados',
        data: data.map((item) => item.count)
      }
    ],

    options: {
      colors: ['#4379F2', '#FF1E1E'],
      dataLabels: {
        enabled: true,
        background: {
          borderRadius: 8
        }
      },

      markers: {
        size: 1
      },

      xaxis: {
        categories: data.map((item) => meses[item._id]),
        title: {
          text: 'Meses'
        }
      },

      tooltip: {
        x: {
          format: 'MM'
        }
      },

      yaxis: {
        title: {
          text: 'Total'
        }
      }
    }
  };
  return <Chart {...chartData} />;
};
