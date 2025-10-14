import { useQuery } from '@tanstack/react-query';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useDiasHabiles from 'hooks/useDate';
import { useFetchTables } from 'lib/dashboard/fetchTables';
import { useFormatDate } from 'hooks/useFormatDate';

export const TablePQRSExpired = () => {
  const { diasHabiles } = useDiasHabiles();
  const { formatDate } = useFormatDate();
  const { fetchPQRSExpired } = useFetchTables();
  const { data, isLoading } = useQuery({
    queryKey: ['pqrsExpired'],
    queryFn: fetchPQRSExpired,
    staleTime: 1000 * 60 * 5
  });
  const getDiasLaborablesClass = (diasLaborables) => {
    return classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'dias text-dark': diasLaborables >= 10 && diasLaborables <= 12,
      'bg-danger bg-gradient text-dark': diasLaborables >= 13
    });
  };

  const getBackgroundColor = (rowData) => {
    const diasLaborables = diasHabiles(rowData.fecha_radicado);
    return <div className={getDiasLaborablesClass(diasLaborables)}>{diasLaborables}</div>;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
      <DataTable
        value={data}
        stripedRows
        removableSort
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage={'No se encontraron radicados'}
        loading={isLoading}
      >
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="fecha_radicado" header="Fecha radicado" sortable body={(rowData) => formatDate(rowData.fecha_radicado)} />
        <Column field="id_departamento" header="Área" />
        <Column field="id_usuario" header="Responsable" />
        <Column field="fecha_asignacion" header="Fecha asignacion" body={(rowData) => formatDate(rowData.fecha_asignacion)} />
        <Column field="fecha_radicado" header="Dias" sortable body={getBackgroundColor} />
      </DataTable>
    </div>
  );
};
