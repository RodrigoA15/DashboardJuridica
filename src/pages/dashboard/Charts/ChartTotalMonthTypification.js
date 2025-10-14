import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { useFetchCharts } from 'lib/dashboard/fetchCharts';
import { meses } from 'data/meses';

const CURRENT_YEAR = new Date().getFullYear();
export const ChartTotalTypification = () => {
  const { fetchChartTypifications } = useFetchCharts();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chart-months-typifications'],
    queryFn: fetchChartTypifications
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" viewBox="0 0 24 24" />
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-center text-red-500 p-4">Error al cargar los datos</p>;
  }

  const tipificaciones = Object.keys(data[0]).filter((key) => key !== 'mes');

  const series = tipificaciones.map((tip) => ({
    name: tip,
    type: tip === 'TUTELAS' ? 'line' : 'bar',
    data: data.map((item) => item[tip] || 0)
  }));

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#0288d1', '#C40C0C', '#2E7D32'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '40%'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#374151']
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
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
      categories: data.map((item) => meses[item.mes - 1]),
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
      style: { fontSize: '13px' }
    }
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Total PQRS y Tutelas por meses ({CURRENT_YEAR})</h3>
      <Chart options={options} series={series} height={330} />
    </div>
  );
};
