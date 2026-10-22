export const MetricTotalTypeAffair = ({ data = [] }) => {
  const itemType2 = data?.find((item) => item._id === '2');
  const count = itemType2 ? itemType2.count : 0;
  const isVisible = itemType2 && itemType2.count > 0;

  return (
    <div className={`rounded-2xl border border-gray-200 bg-[#5A96E3] p-4 h-24 ${isVisible ? 'blinking' : 'opacity-0'}`}>
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-white/90">Tutelas</p>
        <h4 className="text-2xl font-bold text-white/90">{count}</h4>
      </div>
    </div>
  );
};
