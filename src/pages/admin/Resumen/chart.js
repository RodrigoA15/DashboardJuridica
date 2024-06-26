import React, { useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';

function ChartEntidadAdmin() {
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const dateEndMonth = new Date();
  const [fechaInicio, setFechaInicio] = useState(dateFirstMonth);
  const [fechaFin, setFechaFin] = useState(dateEndMonth);

  const [data, setData] = useState({
    series: [
      {
        name: 'Concesion TTO',
        data: []
      },
      {
        name: 'Secretaria',
        data: []
      }
    ],

    options: {
      plotOptions: {
        bar: {
          borderRadius: 10,
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
        categories: ['Movit']
      }
    }
  });

  const dataEntidades = async () => {
    try {
      const response = await axios.get(`/entity/entidadt/${fechaInicio}/${fechaFin}`);
      setData({
        series: [
          {
            data: response.data.map((item) => item.Movit)
          },
          {
            data: response.data.map((item) => item.Secretaria)
          }
        ],
        options: {
          ...data.options
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
    <div>
      <div className="row m-1">
        <div className="col">
          <input className="form-control" type="date" value={fechaInicio} onChange={handleFechaInicio} />
        </div>
        <div className="col">
          <input className="form-control" type="date" value={fechaFin} onChange={handleFechaFin} />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={dataEntidades}>
            Buscar
          </button>
        </div>
      </div>

      <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />
    </div>
  );
}

export default ChartEntidadAdmin;
