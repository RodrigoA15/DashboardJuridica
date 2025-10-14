import { useCallback, useMemo, useState } from 'react';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'context/authContext';
import useDiasHabiles from 'hooks/useDate';
import { useFormatDate } from 'hooks/useFormatDate';
import { useFetchAprobations } from 'lib/PQRS/fetchAprobations';

const STATUS_QUERY = 'Aprobado';
const DATE_APROBATION = new Date();
const ACTIVE = 'No';

export const TableAprobations = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const { formatDate } = useFormatDate();
  const { diasHabiles } = useDiasHabiles();
  const queryClient = useQueryClient();

  const { fetchAprobationsByUser, fetchAssignAprobation } = useFetchAprobations();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const { data, isLoading } = useQuery({
    queryKey: ['aprobations-users', user._id],
    queryFn: () => fetchAprobationsByUser(user._id)
  });

  const mutationAssign = useMutation({
    mutationFn: fetchAssignAprobation,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: ['aprobations-users'] });
    }
  });

  const onGlobalFilterChange = useCallback((e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value }
    }));
  }, []);

  const getDiasLaborablesClass = useCallback((dias) => {
    return classNames('rounded-full flex justify-center items-center text-center font-bold w-8 h-8', {
      'bg-green-500 bg-gradient text-black': dias <= 5,
      'bg-yellow-500 text-black': dias >= 6 && dias <= 9,
      'bg-orange-500 text-black': dias >= 10 && dias <= 12,
      'bg-red-500 bg-gradient text-black': dias >= 13
    });
  }, []);

  const renderDiasLaborables = useCallback(
    (rowData) => {
      const dias = diasHabiles(rowData.fecha_radicado);
      return <div className={getDiasLaborablesClass(dias)}>{dias}</div>;
    },
    [diasHabiles, getDiasLaborablesClass]
  );

  const handleAssign = useCallback(() => {
    const dataToUpdate = selectedRows.map((item) => ({
      _id: item._id,
      estado_aprobacion: STATUS_QUERY,
      fecha_aprobacion: DATE_APROBATION,
      activo: ACTIVE
    }));
    mutationAssign.mutate(dataToUpdate);
  }, [selectedRows, mutationAssign]);

  const header = useMemo(() => {
    const globalValue = filters.global?.value || '';

    return (
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <InputText type="search" value={globalValue} onChange={onGlobalFilterChange} placeholder="Buscar" />

        <button
          className="py-2 px-3 bg-[#289535] text-white text-sm font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
          onClick={handleAssign}
          disabled={selectedRows.length === 0 || mutationAssign.isLoading}
        >
          Aprobar
        </button>
      </div>
    );
  }, [filters, onGlobalFilterChange, handleAssign, mutationAssign.isLoading, selectedRows.length]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {header}
      <DataTable
        value={data}
        stripedRows
        removableSort
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        selectionPageOnly
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="No se encontraron radicados"
        loading={isLoading}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="numero_radicado" header="Número radicado" sortable />
        <Column field="fecha_radicado" header="Fecha radicado" sortable body={(row) => formatDate(row.fecha_radicado)} />
        <Column field="asunto" header="Asunto" />
        <Column field="usuario_envia" header="Usuario envía" />
        <Column field="fecha_asignacion" header="Fecha asignación" body={(row) => formatDate(row.fecha_asignacion) || 'Sin asignar'} />
        <Column field="fecha_radicado" header="Días" sortable body={renderDiasLaborables} />
      </DataTable>
    </div>
  );
};
