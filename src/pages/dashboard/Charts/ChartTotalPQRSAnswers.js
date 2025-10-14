import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { useFetchCharts } from 'lib/dashboard/fetchCharts';

export const ChartTotalPQRSAnswers = () => {
  const { fetchTotalPQRS, fetchTotalAnswers } = useFetchCharts();

  // ================== Queries ==================
  const {
    data: radicados = [],
    isLoading: isLoadingRadicados,
    isError: isErrorRadicados
  } = useQuery({
    queryKey: ['chart-total-radicados'],
    queryFn: fetchTotalPQRS,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: answers = [],
    isLoading: isLoadingAnswers,
    isError: isErrorAnswers
  } = useQuery({
    queryKey: ['chart-total-answers'],
    queryFn: fetchTotalAnswers,
    staleTime: 1000 * 60 * 5
  });

  // ================== Helpers ==================
  const months = useMemo(() => {
    const radicadoMonths = radicados.map((item) => item._id);
    const answerMonths = answers.map((item) => item._id.month);
    return Array.from(new Set([...radicadoMonths, ...answerMonths]));
  }, [radicados, answers]);

  const calculatePercentage = (radicadosCount, answersCount) => {
    if (radicadosCount === 0) return 0;
    const porcentaje = ((radicadosCount - answersCount) / radicadosCount) * 100;
    return porcentaje === 0 ? answersCount : `${porcentaje.toFixed(1)}%`;
  };

  // ================== Estados de carga/error ==================
  if (isLoadingRadicados || isLoadingAnswers) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" viewBox="0 0 24 24" />
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (isErrorRadicados || isErrorAnswers) {
    return <p className="text-center text-red-500 p-4">Error al cargar los datos</p>;
  }
  // ================== Configuración del gráfico ==================
  const chartData = {
    type: 'bar',
    series: [
      {
        name: 'Respuestas',
        data: months.map((month) => {
          const answer = answers.find((a) => a._id.month === month);
          const radicado = radicados.find((r) => r._id === month);

          return {
            x: `Mes ${month}`,
            y: answer?.count || 0,
            goals: [
              {
                name: 'Radicados',
                value: radicado?.count || 0,
                strokeHeight: 2,
                strokeColor: '#FF1E1E'
              }
            ]
          };
        })
      }
    ],
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false }
        // 🚀 sin alto fijo, será responsivo
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          dataLabels: { position: 'top' }
        }
      },
      colors: ['#4379F2'],
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: { fontSize: '12px', colors: ['#000'] },
        formatter: (val, opt) => {
          const radicadosCount = opt.w.config.series[0].data[opt.dataPointIndex].goals[0].value;
          return calculatePercentage(radicadosCount, val);
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '14px',
        customLegendItems: ['Respuestas', 'Radicados'],
        markers: { fillColors: ['#4379F2', '#FF1E1E'] }
      }
    }
  };

  // ================== Render ==================
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Total PQRS por meses ({new Date().getFullYear()})</h3>
      <Chart {...chartData} />
    </div>
  );
};
