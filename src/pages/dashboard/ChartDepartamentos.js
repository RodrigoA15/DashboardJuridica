import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import ReactApexChart from 'react-apexcharts';
import { Toaster, toast } from 'sonner';

function ChartDepartamentos() {
  const today = new Date();
  const fecha1 = new Date(today.getFullYear(), today.getMonth(), 0);
  const fecha2 = new Date();
  const [fechaInicio, setFechaInicio] = useState(fecha1);
  const [fechaFin, setFechaFin] = useState(fecha2);

  const [data, setData] = useState({
    series: [
      {
        name: 'Juridica',
        data: []
      },
      {
        name: 'RMI',
        data: []
      },
      {
        name: 'FrontOffice',
        data: []
      },
      {
        name: 'Sistemas',
        data: []
      },
      {
        name: 'Archivo',
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
    apiDataDepartamentos();
  }, []);

  const apiDataDepartamentos = async () => {
    try {
      const response = await axios.get(`/radicados/chartdepartamentos/${fechaInicio}/${fechaFin}`);
      const fecha = response.data.map((departamento) =>
        new Date(departamento.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })
      );

      setData({
        series: [
          {
            data: response.data.map((juridica) => juridica.JURIDICA)
          },
          {
            data: response.data.map((rmi) => rmi.RMI)
          },
          {
            data: response.data.map((front) => front.FRONT_OFFICE)
          },
          {
            data: response.data.map((sistemas) => sistemas.SISTEMAS)
          },
          {
            data: response.data.map((archivo) => archivo.ARCHIVO)
          },
          {
            data: response.data.map((secretaria) => secretaria.SECRETARIA)
          }
        ],
        options: {
          ...data.options,
          xaxis: {
            categories: fecha
          }
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados por área');
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
          <button className="btn btn-primary" onClick={apiDataDepartamentos}>
            Buscar
          </button>
        </div>
      </div>

      <ReactApexChart options={data.options} series={data.series} type="area" height={350} />
    </div>
  );
}

export default ChartDepartamentos;
