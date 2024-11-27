import { useEffect, useState } from 'react';
import axios from 'api/axios';
import Chart from 'react-apexcharts';

export const ChartEstados = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    statesByArea();
  }, []);

  const statesByArea = async () => {
    try {
      const response = await axios.get('/chartAdmin/radicadosAreasEstados');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cleanData = data.map((radicado) => radicado.radicados).flat();

  const seriesData = cleanData.map((item) => ({
    name: item.estado,
    data: data.map((area) => {
      const radicadoFound = area.radicados.find((r) => r.estado === item.estado);
      return radicadoFound ? radicadoFound.count : 0;
    })
  }));

  const chartData = {
    type: 'bar',
    series: seriesData,
    options: {
      plotOptions: {
        bar: {
          borderRadius: 8,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20
      },
      xaxis: {
        categories: data.map((item) => item._id)
      }
    }
  };

  return <Chart {...chartData} height={450} />;
};
