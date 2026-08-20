import { useMemo, useState } from 'react';
import axios from 'api/axios';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const getRadicadosByEntidad = async () => {
  const { data } = await axios.get('/radicados/averages-years');

  return data;
};

export const ChartMonthlyRadicados = () => {
  const [selectedEntidad, setSelectedEntidad] = useState('');

  const {
    data = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['radicados-entidad'],
    queryFn: getRadicadosByEntidad,
    staleTime: 5 * 60 * 1000
  });

  // ==========================================
  // ENTIDADES DISPONIBLES
  // ==========================================

  const entidades = useMemo(() => {
    return data.map((item) => item.entidad);
  }, [data]);

  // ==========================================
  // ENTIDAD SELECCIONADA
  // ==========================================

  const entidadActual = useMemo(() => {
    if (!data.length) return null;

    return data.find((item) => item.entidad === selectedEntidad) || data[0];
  }, [data, selectedEntidad]);

  // ==========================================
  // SERIES
  // ==========================================

  const series = useMemo(() => {
    if (!entidadActual) return [];

    const yearSeries = entidadActual.years.map((yearData) => {
      const values = MONTHS.map((_, index) => {
        const month = yearData.meses.find((item) => item.month === index + 1);

        return month ? month.count : null;
      });

      return {
        name: String(yearData.year),
        data: values
      };
    });

    // Promedio histórico
    const averageValues = MONTHS.map((_, index) => {
      const month = entidadActual.promedioMensual.find((item) => item.month === index + 1);

      return month ? month.average : null;
    });

    return [
      ...yearSeries,

      {
        name: 'Promedio histórico',
        data: averageValues
      }
    ];
  }, [entidadActual]);

  // ==========================================
  // OPCIONES APEXCHARTS
  // ==========================================

  const options = useMemo(() => {
    if (!entidadActual) return {};

    const yearCount = entidadActual.years.length;

    return {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },

      stroke: {
        curve: 'smooth',

        width: [...Array(yearCount).fill(2), 3]
      },

      markers: {
        size: 4,
        hover: {
          size: 6
        }
      },

      xaxis: {
        categories: MONTHS,

        labels: {
          rotate: -45
        }
      },

      yaxis: {
        title: {
          text: 'Cantidad de radicados'
        },

        labels: {
          formatter: (value) => Math.round(value).toLocaleString('es-CO')
        }
      },

      tooltip: {
        shared: true,

        intersect: false,

        y: {
          formatter: (value) => {
            if (value === null || value === undefined) {
              return 'Sin datos';
            }

            return value.toLocaleString('es-CO');
          }
        }
      },

      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },

      dataLabels: {
        enabled: false
      },

      grid: {
        strokeDashArray: 4
      },

      noData: {
        text: 'No hay datos disponibles'
      }
    };
  }, [entidadActual]);

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-xl bg-white">
        <span className="text-sm text-gray-500">Cargando información...</span>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-xl bg-white">
        <span className="text-sm text-red-500">Error al cargar los radicados.</span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm">
      {/* HEADER */}
      <div className="mb-4 flex items-start justify-between gap-4">
        {/* TÍTULO */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Radicados por entidad</h2>

          <p className="text-sm text-gray-500">Comparaci&oacute;n mensual y promedio hist&oacute;rico</p>
        </div>

        {/* SELECT */}
        <div className="flex items-center gap-2">
          <label htmlFor="select-entidad" className="text-xs font-medium text-gray-500">
            Entidad:
          </label>
          <select
            value={selectedEntidad || entidades[0] || ''}
            onChange={(event) => setSelectedEntidad(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {entidades.map((entidad) => (
              <option key={entidad} value={entidad}>
                {entidad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRÁFICA */}
      <div className="w-full">{entidadActual && <Chart options={options} series={series} type="line" height={400} width="100%" />}</div>
    </div>
  );
};
