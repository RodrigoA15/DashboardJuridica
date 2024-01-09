import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';
import { Toaster, toast } from 'sonner';

function CanalEntradaChart() {
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 0);
  const dateEndMonth = new Date();
  const [fechaInicio, setFechaInicio] = useState(dateFirstMonth);
  const [fechaFin, setFechaFin] = useState(dateEndMonth);

  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Presencial',
        data: []
      },
      {
        name: 'Correo Electronico',
        data: []
      },
      {
        name: 'Orfeo',
        data: []
      },
      {
        name: 'Correo Certificado',
        data: []
      }
    ],

    options: {
      chart: {
        heigth: 100,
        tipe: 'line'
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        curve: 'smooth'
      },

      markers: {
        size: 6
        // hover: {
        //   size: 9
        // }
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
    dataCanalesChart();
  }, []);

  const dataCanalesChart = async () => {
    try {
      const response = await axios.get(`/radicados/chart_canal/${fechaInicio}/${fechaFin}`);
      const fecha = response.data.map((canal) => new Date(canal.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' }));

      setChartData({
        series: [
          {
            data: response.data.map((item) => item.Presencial)
          },
          {
            data: response.data.map((item) => item.Correo)
          },
          {
            data: response.data.map((item) => item.Orfeo)
          },
          {
            data: response.data.map((item) => item.CorreoCertificado)
          }
        ],

        options: {
          ...chartData.options,
          xaxis: {
            categories: fecha
          }
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados por canales de entrada');
      } else {
        toast.error('No se pudo cargar la información', { description: 'error de servidor' });
      }
    }
  };

  const handleFechaInicio = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFin = (e) => {
    setFechaFin(e.target.value);
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />

      <div className="row m-1">
        <div className="col">
          <input className="form-control" type="date" value={fechaInicio} onChange={handleFechaInicio} />
        </div>
        <div className="col">
          <input className="form-control" type="date" value={fechaFin} onChange={handleFechaFin} />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={dataCanalesChart}>
            Buscar
          </button>
        </div>
      </div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" heigth={100} />
    </div>
  );
}

export default CanalEntradaChart;
