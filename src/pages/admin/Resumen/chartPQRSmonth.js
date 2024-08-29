import axios from 'api/axios';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
export const ChartPQRSmonth = () => {
  const [data, setData] = useState([]);
  const [dataReturned, setDataReturned] = useState([]);

  useEffect(() => {
    PQRSByMonthApi();
    tutelasMonth();
  }, []);

  const PQRSByMonthApi = async () => {
    try {
      const response = await axios.get('/radicados/month');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const tutelasMonth = async () => {
    try {
      const response = await axios.get('/radicados/tutelas');
      setDataReturned(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = {
    series: [
      {
        name: 'PQRS',
        type: 'bar',
        data: data.map((item) => item.count)
      },
      {
        name: 'TUTELAS',
        type: 'line',
        data: dataReturned.map((item) => item.count)
      }
    ],

    options: {
      colors: ['#0288d1', '#C40C0C'],
      plotOptions: {
        bar: {
          borderRadius: 6
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 5
      },
      xaxis: {
        categories: dataReturned.map((item) => item.month)
      }
    }
  };

  return <Chart options={chartData.options} series={chartData.series} type="line" />;
};
