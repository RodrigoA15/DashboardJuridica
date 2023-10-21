import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function CanalEntradaChart() {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Presencial',
        data: []
      },
      {
        name: 'Correo Electronico',
        data: []
      },
      {
        name: 'Orfeo',
        data: []
      },
      {
        name: 'Correo Certificado',
        data: []
      }
    ],

    options: {
      chart: {
        heigth: 100,
        tipe: 'line'
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        curve: 'smooth'
      },

      markers: {
        size: 6
        // hover: {
        //   size: 9
        // }
      },

      xaxis: {
        categories: []
      },

      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    }
  });

  useEffect(() => {
    dataCanalesChart();
  }, []);

  const dataCanalesChart = async () => {
    try {
      const response = await axios.get('/radicados/chart_canal');
      const fecha = response.data.map((canal) => new Date(canal.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' }));

      setChartData({
        series: [
          {
            data: response.data.map((item) => item.Presencial)
          },
          {
            data: response.data.map((item) => item.Correo)
          },
          {
            data: response.data.map((item) => item.Orfeo)
          },
          {
            data: response.data.map((item) => item.CorreoCertificado)
          }
        ],

        options: {
          ...chartData.options,
          xaxis: {
            categories: fecha
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" heigth={100} />
    </div>
  );
}

export default CanalEntradaChart;
