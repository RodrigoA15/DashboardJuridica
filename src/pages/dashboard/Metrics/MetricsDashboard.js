import { useAuth } from 'context/authContext';
import { useQuery } from '@tanstack/react-query';
import { MetricTotalPQRS } from './MetricTotalPQRS';
import { usePermissions } from 'hooks/usePermissions';
import { MetricTotalAnswers } from './MetricTotalAnswers';
import { MetricTotalReturned } from './MetricTotalReturned';
import { MetricTotalEntities } from './MetricTotalEntities';
import { MetricTotalAssigned } from './MetricTotalAssigned';
import { MetricTotalDesacatos } from './MetricTotalDesacatos';
import { MetricTotalTypeAffair } from './MetricTotalTypeAffair';
import { MetricTotalUnanswered } from './MetricTotalUnanswered';
import { MetricTotalWitoutAssigned } from './MetricTotalWitoutAssigned';
import { useFetchMetrics } from 'lib/dashboard/fetchMetrics';

export const MetricsDashboard = () => {
  const { user } = useAuth();
  const { canViewMetricTotalReturned } = usePermissions(user);
  const { fetchAllMetrics } = useFetchMetrics();

  const { data: newData } = useQuery({
    queryKey: ['allMetrics'],
    queryFn: fetchAllMetrics
  });

  return (
    <div>
      {newData && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-6">
            <MetricTotalPQRS data={newData?.total_radicados} />
            <MetricTotalEntities data={newData?.total_entities} />
            <MetricTotalAnswers data={newData?.total_answers} />
            <MetricTotalAssigned data={newData?.total_assignments} />
            <MetricTotalWitoutAssigned data={newData?.total_without_assignments} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 mt-3">
            {canViewMetricTotalReturned && <MetricTotalReturned data={newData?.total_returned} />}
            <MetricTotalTypeAffair data={newData?.total_type_affair} />
            <MetricTotalDesacatos data={newData?.total_type_affair} />
            <MetricTotalUnanswered data={newData?.total_without_answers} />
          </div>
        </>
      )}
    </div>
  );
};
