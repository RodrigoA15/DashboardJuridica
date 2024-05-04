import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function ChartArea() {
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const radicadosResponse = await axios.get('/chartAdmin/radicadosAreas');
      const respuestasResponse = await axios.get('/chartAdmin/radicadosAreasRespuestas');

      const radicadosData = radicadosResponse.data;
      const respuestasData = respuestasResponse.data;

      const categories = radicadosData.map((item) => item.departamento);

      const unionGraficas = [
        // Radicados sin responder
        {
          name: 'Radicados',
          data: radicadosData.map((item) => item.radicados)
        },
        //Radicados con respuesta
        {
          name: 'Respuestas',
          data: respuestasData.map((item) => item.radicados)
        }
      ];

      setData({
        series: unionGraficas,
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
    <div>
      <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />
    </div>
  );
}

export default ChartArea;
