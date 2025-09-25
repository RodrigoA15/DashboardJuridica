import { useQuery } from '@tanstack/react-query';
import { useFetchMetrics } from 'lib/dashboard/fetchMetrics';

export const MetricTotalUnanswered = () => {
  const { fetchTotalUnanswered } = useFetchMetrics();
  const { data } = useQuery({
    queryKey: ['total-unanswered'],
    queryFn: fetchTotalUnanswered,
    placeholderData: [
      {
        count: 0
      }
    ]
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#9DBC98] p-4 h-28">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-white/90">PENDIENTE RESPUESTA</p>
        <h4 className="text-2xl font-bold text-white/90">{data[0].count || '0'}</h4>
      </div>
    </div>
  );
};
