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
          columnWidth: '50%',
          endingShape: 'rounded'
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        type: "datatime",
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
      const response = await axios.get('/radicados/chart_entidad');
      const formattedDates = response.data.map((item) => new Date(item.fecha).toDateString());
      setChartData({
        ...chartData,
        series: [
          {
            data: response.data.map((item) => item.Movit)
          },
          {
            data: response.data.map((item) => item.Secretaria)
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
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={chartData.options.chart.height} />
    </div>
  );
}

export default ChartEntidad;
