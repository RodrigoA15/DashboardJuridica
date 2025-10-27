import { useQuery } from '@tanstack/react-query';
import { useFetchMetrics } from 'lib/dashboard/fetchMetrics';

export const MetricTotalAnswers = () => {
  const { fetchTotalAnswers } = useFetchMetrics();
  const { data } = useQuery({
    queryKey: ['total-answers'],
    queryFn: fetchTotalAnswers,
    placeholderData: [
      {
        count: 0
      }
    ]
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#9DBC98] p-4 h-24">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-white/90">TOTAL RESPUESTAS</p>
        <h4 className="text-2xl font-bold text-white/90">{data[0].count || '0'}</h4>
      </div>
    </div>
  );
};
