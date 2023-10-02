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
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '80%',
          endingShape: 'rounded'
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        type: 'datetime',
        categories: []
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
      const movit = await axios.get('/radicados/chart_entidad');
      const formattedDates = movit.data.map((item) => item.fecha_radicado);

      setChartData({
        series: [
          {
            data: movit.data.map((item) => item.Movit)
          },
          {
            data: secretaria.data.map((item) => item.Secretaria)
          }
        ],

        options: {
          ...chartData.options.xaxis,
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
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
}

export default ChartEntidad;
