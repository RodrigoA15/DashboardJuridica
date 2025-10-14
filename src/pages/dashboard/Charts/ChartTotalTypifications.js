import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { useFetchCharts } from 'lib/dashboard/fetchCharts';

export const ChartTotalTypifications = () => {
  const { fetchTotalTypifications } = useFetchCharts();

  const {
    data = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['total-typifications'],
    queryFn: fetchTotalTypifications,
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" viewBox="0 0 24 24" />
        <p className="text-sm text-gray-500">Cargando datos...</p>
      </div>
    );
  }

  if (isError || data.length === 0) {
    return <p className="text-center text-red-500 p-4">Error al cargar la información</p>;
  }

  const series = data.map((item) => item.count);
  const labels = data.map((item) => item.nombre_tipificacion || 'SIN DESCRIPCIÓN');

  const COLORS = ['#5A96E3', '#9DBC98', '#FFA33C', '#F46060', '#6C63FF'];

  const options = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels,
    colors: COLORS,
    legend: { show: false },
    dataLabels: {
      enabled: true,
      style: { fontSize: '14px', fontWeight: 'bold', colors: ['#fff'] }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '20px',
              fontWeight: 600,
              color: '#1F2937',
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px' },
      y: { formatter: (val) => `${val} peticiones` }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">Total PQRS y Tutelas</h3>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="flex justify-center">
          <Chart options={options} series={series} type="donut" height={320} />
        </div>

        <div className="flex flex-col gap-3">
          {data.map((item, index) => (
            <div key={item.id_tipificacion} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span className="text-sm font-medium text-gray-800">{item.nombre_tipificacion || 'SIN DESCRIPCIÓN'}:</span>
              <span className="ml-auto text-sm text-gray-600">{item.count} peticiones</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
