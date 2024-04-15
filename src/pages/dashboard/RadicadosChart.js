import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';
import { Toaster, toast } from 'sonner';

function RadicadosChart() {
  const dia = new Date();
  const fecha1 = new Date(dia.getFullYear(), dia.getMonth(), 0);
  const fecha2 = new Date();
  const [fechaInicio, setFechaInicio] = useState(fecha1);
  const [fechaFin, setFechaFin] = useState(fecha2);
  const [error, setError] = useState(null);

  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Radicados',
        data: []
      },
      {
        name: 'Respuesta',
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
      }
    }
  });

  const apiChartRadicados = async () => {
    try {
      const creados = await axios.get(`/radicados/cantidad_creados/${fechaInicio}/${fechaFin}`);
      const response = await axios.get(`/radicados/chart_radicados/${fechaInicio}/${fechaFin}`);
      const fechaRadicado = response.data.map((item) =>
        new Date(item.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric' })
      );
      const fechaCreados = creados.data.map((item) =>
        new Date(item.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC', day: 'numeric' })
      );

      setChartData({
        series: [
          {
            data: creados.data.map((item) => item.NUM_RADICADOS)
          },
          {
            data: response.data.map((item) => item.NUM_RADICADOS)
          }
        ],
        options: {
          ...chartData.options,
          xaxis: {
            type: 'datetime',
            categories: fechaCreados,
            fechaRadicado
          }
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No se encontraron respuestas ');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
        console.log(error);
      }
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
      <Toaster position="top-right" richColors expand={true} offset="80px" />

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
      {error !== null ? (
        <div className="error-message">{error}</div>
      ) : (
        <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
      )}
    </div>
  );
}

export default RadicadosChart;
