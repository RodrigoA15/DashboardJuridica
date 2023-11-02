import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function RadicadosChart() {
  const dia = new Date();
  const fecha1 = new Date(dia.getFullYear(), dia.getMonth(), 0);
  const fecha2 = new Date();
  const [fechaInicio, setFechaInicio] = useState(fecha1);
  const [fechaFin, setFechaFin] = useState(fecha2);

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
        type: 'line',
        group: 'social'
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

  const apiChartRadicados = async () => {
    try {
      const response = await axios.get(`/radicados/chart_radicados/${fechaInicio}/${fechaFin}`);
      const fechaRadicado = response.data.map((item) => item.fecha_radicado);

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
            categories: fechaRadicado
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener datos del gráfico:', error);
    }
  };

  useEffect(() => {
    apiChartRadicados();

    const intervalId = setInterval(apiChartRadicados, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFechaInicio = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFin = (e) => {
    setFechaFin(e.target.value);
  };

  return (
    <div id="chart">
      <div className="row m-1">
        <div className="col">
          <input className="form-control" type="date" onChange={handleFechaInicio} />
        </div>
        <div className="col">
          <input className="form-control" type="date" onChange={handleFechaFin} />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={apiChartRadicados}>
            Buscar
          </button>
        </div>
      </div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
    </div>
  );
}

export default RadicadosChart;
