import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import axios from 'api/axios';

const fetchUserAnswers = async (startDate, endDate, signal) => {
  const response = await axios.get(`/answer/answer-users/${startDate}/${endDate}`, { signal });
  return response.data;
};

export const TableUsersAnswer = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (signal) => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetchUserAnswers(startDate, endDate, signal);
        setData(response ?? []);
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        setError('Ocurrió un error al cargar las respuestas de los usuarios.');
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

  const getTypificationTotal = useCallback((item, name) => {
    if (!Array.isArray(item?.tipificacion)) return 0;
    const found = item.tipificacion.find((t) => t.nombre === name);
    return found?.total ?? 0;
  }, []);

  const renderHeader = () => (
    <div className="flex flex-col pb-2">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Respuestas por Usuario</h2>
      <p className="text-xs text-slate-500">Datos del rango de fechas aplicado en el filtro superior.</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <DataTable
        value={data}
        loading={loading}
        emptyMessage={
          <div className="py-8 text-center text-sm text-slate-400 font-medium">{error || 'No se encontraron datos registrados.'}</div>
        }
        header={renderHeader()}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        removableSort
        stripedRows
        pt={{
          header: { className: 'bg-transparent border-b border-slate-100 pb-4 mb-2' },
          table: { className: 'border-collapse w-full' },
          thead: { className: 'bg-slate-50/80 rounded-lg text-slate-600 text-xs uppercase tracking-wider font-semibold' },
          tbody: { className: 'divide-y divide-slate-100 text-sm text-slate-700' },
          paginator: {
            className: 'bg-transparent border-t border-slate-100 pt-3 text-xs text-slate-500 flex justify-end gap-1'
          }
        }}
        tableStyle={{ minWidth: '35rem' }}
        size="small"
        responsiveLayout="scroll"
      >
        <Column className="border-2 border-primary-subtle" field="_id" header="Usuario" align="center" sortable />
        <Column
          className="border-2 border-primary-subtle"
          header="PQRS"
          align="center"
          body={(item) => getTypificationTotal(item, 'PQRS')}
        />
        <Column
          className="border-2 border-primary-subtle"
          header="Tutelas"
          align="center"
          body={(item) => getTypificationTotal(item, 'TUTELAS')}
        />
        <Column className="border-2 border-primary-subtle" field="count" align="center" header="Total" sortable />
      </DataTable>
    </div>
  );
};

TableUsersAnswer.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired
};
