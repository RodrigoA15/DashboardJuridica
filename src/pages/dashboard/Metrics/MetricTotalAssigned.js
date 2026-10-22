export const MetricTotalAssigned = ({ data }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFA33C] p-4 h-24">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-white/90">TOTAL ASIGNADAS</p>
        <h4 className="text-2xl font-bold text-white/90">{data[0].count || '0'}</h4>
      </div>
    </div>
  );
};
