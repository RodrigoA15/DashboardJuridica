import { useQuery } from '@tanstack/react-query';
import { useFetchMetrics } from 'lib/dashboard/fetchMetrics';
export const MetricTotalEntities = () => {
  const { fetchTotalEntities } = useFetchMetrics();
  const { data } = useQuery({
    queryKey: ['total-entities'],
    queryFn: fetchTotalEntities,
    placeholderData: [
      {
        count: 0,
        entidad: 'N/A'
      }
    ]
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#5A96E3] p-4 h-28">
      {data?.map((item) => (
        <div key={item.entidad} className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/90">{item.entidad}</p>
          <h4 className="text-2xl font-bold text-white/90">{item.count}</h4>
        </div>
      ))}
    </div>
  );
};
