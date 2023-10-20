import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function ChartEntidad() {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Movit',
        data: []
      },
      {
        name: 'Secretaria',
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
      markers: {
        size: 6,
        hover: {
          size: 9
        }
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
    apiChartData();

    const time = setInterval(apiChartData, 5000);

    return () => clearInterval(time);
  }, []);

  const apiChartData = async () => {
    try {
      const secretaria = await axios.get('/radicados/chart_entidad2');
      // const movit = await axios.get('/radicados/chart_entidad');
      const formattedDates = secretaria.data.map((item) => new Date(item.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' }));
      // const fechas = await axios.get('/radicados/chart_fecha');
      // const formattedDates = fechas.data.map((data) => new Date(data.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' }));

      setChartData({
        series: [
          {
            data: secretaria.data.map((item) => item.Movit)
          },
          {
            data: secretaria.data.map((item) => item.Secretaria)
          }
        ],

        options: {
          ...chartData.options,
          xaxis: {
            categories: formattedDates
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={350} />
    </div>
  );
}

export default ChartEntidad;
