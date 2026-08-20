import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { useFetchCharts } from 'lib/dashboard/fetchCharts';
import { meses } from 'data/meses';

const CURRENT_YEAR = new Date().getFullYear();

export const ChartTotalTypification = () => {
  const { fetchChartTypifications } = useFetchCharts();
  const [selectedEntidad, setSelectedEntidad] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['chart-months-tipifications'],
    queryFn: fetchChartTypifications
  });
  
  const entidadesDisponibles = Array.from(new Set(data?.flatMap((mesData) => mesData.entity.map((entidad) => entidad.name)) || []));

  // Seleccionar la primera entidad automáticamente al cargar los datos
  useEffect(() => {
    if (entidadesDisponibles.length > 0 && !selectedEntidad) {
      setSelectedEntidad(entidadesDisponibles[0]);
    }
  }, [entidadesDisponibles, selectedEntidad]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" viewBox="0 0 24 24" />
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return <p className="text-center text-red-500 p-4">Error al cargar los datos</p>;
  }

  // 2. Extraer las tipificaciones que pertenecen ÚNICAMENTE a la entidad seleccionada
  const tipificacionesDeEntidad = Array.from(
    new Set(
      data.flatMap((mesData) => {
        const ent = mesData.entity.find((e) => e.name === selectedEntidad);
        return ent ? ent.tipificaciones.map((t) => t.name) : [];
      })
    )
  );

  // 3. Crear las 'series' filtradas por la entidad seleccionada
  const series = tipificacionesDeEntidad.map((nombreTip) => ({
    name: nombreTip,
    type: nombreTip.toUpperCase().includes('TUTELA') ? 'line' : 'bar',
    data: data.map((mesData) => {
      // Buscar la entidad seleccionada en el mes actual
      const ent = mesData.entity.find((e) => e.name === selectedEntidad);
      if (!ent) return 0;

      // Buscar la tipificación dentro de esa entidad
      const tip = ent.tipificaciones.find((t) => t.name === nombreTip);
      return tip ? tip.count : 0;
    })
  }));

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '40%'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#374151']
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 3, 3]
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { size: 7 }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      labels: { colors: '#374151' }
    },
    xaxis: {
      categories: data.map((item) => meses[item._id - 1]),
      labels: { style: { fontSize: '12px', colors: '#6B7280' } },
      axisBorder: { color: '#E5E7EB' }
    },
    yaxis: {
      labels: {
        style: { fontSize: '12px', colors: '#6B7280' }
      }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px' },
      shared: true,
      intersect: false
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Encabezado con el Selector de Entidad */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-800">Tipificaciones por Mes ({CURRENT_YEAR})</h3>

        {/* Desplegable para seleccionar la entidad */}
        <div className="flex items-center gap-2">
        <label htmlFor="select-entidad" className="text-xs font-medium text-gray-500">
            Entidad:
          </label>
          <select
            id="select-entidad"
            value={selectedEntidad}
            onChange={(e) => setSelectedEntidad(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {entidadesDisponibles.map((entidad) => (
              <option key={entidad} value={entidad}>
                {entidad}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Chart options={options} series={series} height={330} />
    </div>
  );
};
