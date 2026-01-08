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
    <>
      {data?.map((item) => (
        <div key={item.entidad} className="rounded-2xl border border-gray-200 bg-[#5A96E3] p-4 h-24">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/90">{item.entidad || 'N/A'}</p>
            <h4 className="text-2xl font-bold text-white/90">{item.count || 0}</h4>
          </div>
        </div>
      ))}
    </>
  );
};
