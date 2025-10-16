import { MetricTotalAnswers } from './MetricTotalAnswers';
import { MetricTotalAssigned } from './MetricTotalAssigned';
import { MetricTotalDesacatos } from './MetricTotalDesacatos';
import { MetricTotalEntities } from './MetricTotalEntities';
import { MetricTotalPQRS } from './MetricTotalPQRS';
import { MetricTotalReturned } from './MetricTotalReturned';
import { MetricTotalTypeAffair } from './MetricTotalTypeAffair';
import { MetricTotalUnanswered } from './MetricTotalUnanswered';
import { MetricTotalWitoutAssigned } from './MetricTotalWitoutAssigned';
import { usePermissions } from 'hooks/usePermissions';
import { useAuth } from 'context/authContext';

export const MetricsDashboard = () => {
  const { user } = useAuth();
  const { canViewMetricTotalReturned } = usePermissions(user);
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-6">
        <MetricTotalPQRS />
        <MetricTotalEntities />
        <MetricTotalAnswers />
        <MetricTotalAssigned />
        <MetricTotalWitoutAssigned />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 mt-3">
        {canViewMetricTotalReturned && <MetricTotalReturned />}
        <MetricTotalTypeAffair />
        <MetricTotalDesacatos />
        <MetricTotalUnanswered />
      </div>
    </div>
  );
};
