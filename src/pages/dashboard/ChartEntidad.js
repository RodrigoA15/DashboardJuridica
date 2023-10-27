import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function ChartEntidad() {
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const dateEndMonth = new Date();
  const [fechaInicio, setFechaInicio] = useState(dateFirstMonth);
  const [fechaFin, setFechaFin] = useState(dateEndMonth);

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
      const secretaria = await axios.get(`/radicados/chart_entidad2/${fechaInicio}/${fechaFin}`);
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
          <input className="form-control" type="date" value={fechaInicio} onChange={handleFechaInicio} />
        </div>
        <div className="col">
          <input className="form-control" type="date" value={fechaFin} onChange={handleFechaFin} />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={apiChartData}>
            Buscar
          </button>
        </div>
      </div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={350} />
    </div>
  );
}

export default ChartEntidad;
