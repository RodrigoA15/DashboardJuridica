import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function RadicadosChart() {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Radicados',
        data: []
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
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

  const apiChartRadicados = async () => {
    try {
      const response = await axios.get('/radicados/chart_radicados');
      const fecha = response.data.map((item) => item.fecha_radicado);

      setChartData({
        series: [
          {
            data: response.data.map((item) => item.NUM_RADICADOS)
          }
        ],
        options: {
          ...chartData.options.xaxis,
          xaxis: {
            type: 'datetime',
            categories: fecha
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener datos del gráfico:', error);
    }
  };

  useEffect(() => {
    apiChartRadicados();

    // const intervalId = setInterval(apiChartRadicados, 5000);

    // return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={350} />
    </div>
  );
}

export default RadicadosChart;
