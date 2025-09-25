import { useQuery } from '@tanstack/react-query';
import { useFetchMetrics } from 'lib/dashboard/fetchMetrics';

export const MetricTotalWitoutAssigned = () => {
  const { fetchTotalWithoutAssigned } = useFetchMetrics();
  const { data } = useQuery({
    queryKey: ['total-without-assigned'],
    queryFn: fetchTotalWithoutAssigned,
    placeholderData: [
      {
        count: 0
      }
    ]
  });

  return (
    // <div className="rounded-2xl border border-gray-200 bg-[#F46060] p-5 md:p-6">
    <div className="rounded-2xl border border-gray-200 bg-[#F46060] p-4 h-28">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-white/90">POR ASIGNAR</p>
        <h4 className="text-2xl font-bold text-white/90">{data[0].count || '0'}</h4>
      </div>
    </div>
  );
};
