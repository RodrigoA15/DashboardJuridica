import { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function ChartEstados() {
  const [data, setData] = useState({
    series: [],
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
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },
      xaxis: {
        categories: []
      }
    }
  });

  useEffect(() => {
    apiRadicadosEstados();
  }, []);

  const apiRadicadosEstados = async () => {
    try {
      const radicadoEstados = await axios.get('/radicadosAreasEstados');
      const radicadosResponse = radicadoEstados.data;

      const categories = radicadosResponse.map((area) => area.departamento);
      const seriesData = radicadosResponse[0].radicados.map((radicado) => ({
        name: radicado.estado,
        data: radicadosResponse.map((area) => area.radicados.find((item) => item.estado === radicado.estado).count)
      }));

      setData({
        series: seriesData,
        options: {
          ...data.options,
          xaxis: {
            categories: categories
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chart-container">
      <ReactApexChart options={data.options} series={data.series} type="bar" height={450} />
    </div>
  );
}

export default ChartEstados;
