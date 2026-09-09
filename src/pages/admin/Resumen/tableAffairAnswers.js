import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import axios from 'api/axios';

const fetchAsuntosByTipificacion = async (startDate, endDate, signal) => {
  const response = await axios.get(`/answer/affair-answers/${startDate}/${endDate}`, { signal });
  return response.data;
};

export const TableAffairsAnswers = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState('');

  const fetchData = useCallback(
    async (signal) => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetchAsuntosByTipificacion(startDate, endDate, signal);

        if (response?.success && Array.isArray(response.data)) {
          setData(response.data);

          if (response.data.length > 0) {
            setSelectedId((prev) => {
              const exists = response.data.some((item) => item._id === prev);
              return exists ? prev : response.data[0]._id;
            });
          } else {
            setSelectedId('');
          }
        } else {
          setError('No se obtuvo una respuesta válida del servidor.');
        }
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        setError('Ocurrió un error al cargar la información de asuntos.');
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const currentGroup = useMemo(() => data.find((group) => group._id === selectedId), [data, selectedId]);
  const asuntosTableData = useMemo(() => currentGroup?.asuntos ?? [], [currentGroup]);

  const renderHeader = () => (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Desglose de Asuntos por Tipificaci&oacute;n</h2>
        <p className="text-xs text-slate-500">Selecciona una tipificaci&oacute;n para analizar los asuntos del rango filtrado.</p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <label htmlFor="tipificacion-select" className="text-xs font-semibold text-slate-500 pl-2">
            Tipificaci&oacute;n:
          </label>
          <select
            id="tipificacion-select"
            value={selectedId}
            disabled={loading || data.length === 0}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white text-xs font-medium text-slate-700 outline-none px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {data.map((group) => (
              <option key={group._id} value={group._id}>
                {group._id}
              </option>
            ))}
          </select>
        </div>

        {currentGroup && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
            <span className="text-xs font-bold text-emerald-800">Total {currentGroup._id}:</span>
            <span className="text-sm font-extrabold text-emerald-700">{currentGroup.totalTipoAsunto?.toLocaleString() ?? 0}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <DataTable
        value={asuntosTableData}
        loading={loading}
        emptyMessage={
          <div className="py-8 text-center text-sm text-slate-400 font-medium">
            {error || 'No se encontraron asuntos para la tipificación seleccionada.'}
          </div>
        }
        header={renderHeader()}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        removableSort
        tableStyle={{ minWidth: '100%' }}
        size="normal"
        pt={{
          header: { className: 'bg-transparent border-b border-slate-100 pb-4 mb-2' },
          table: { className: 'border-collapse w-full' },
          thead: { className: 'bg-slate-50/80 rounded-lg text-slate-600 text-xs uppercase tracking-wider font-semibold' },
          tbody: { className: 'divide-y divide-slate-100 text-sm text-slate-700' },
          paginator: {
            className: 'bg-transparent border-t border-slate-100 pt-3 text-xs text-slate-500 flex justify-end gap-1'
          }
        }}
      >
        <Column
          field="asunto"
          header="Nombre del Asunto"
          sortable
          headerClassName="text-slate-600 font-medium py-3 px-4"
          bodyClassName="py-3.5 px-4 text-xs font-medium text-slate-700 leading-relaxed"
        />

        <Column
          field="total"
          header="Cantidad de Casos"
          align="center"
          sortable
          headerClassName="text-slate-600 font-medium py-3 px-4"
          body={(item) => (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
              {item.total}
            </span>
          )}
        />
      </DataTable>
    </div>
  );
};

TableAffairsAnswers.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired
};
