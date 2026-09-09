import PropTypes from 'prop-types';

/** Filtro de rango de fechas controlado por el padre. */
export const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-3">
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
      <input
        type="date"
        aria-label="Fecha inicio"
        className="bg-white text-xs font-medium text-slate-700 outline-none px-2 py-1 rounded focus:ring-2 focus:ring-emerald-500/20"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />
      <span className="text-slate-400 text-xs font-semibold">a</span>
      <input
        type="date"
        aria-label="Fecha fin"
        className="bg-white text-xs font-medium text-slate-700 outline-none px-2 py-1 rounded focus:ring-2 focus:ring-emerald-500/20"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
      />
    </div>

    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
    >
      Filtrar
    </button>
  </form>
);

DateRangeFilter.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
