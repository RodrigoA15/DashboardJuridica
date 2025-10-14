import { useState, useCallback, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import WarningIcon from '@mui/icons-material/Warning';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useDiasHabiles from 'hooks/useDate';
import { useAuth } from 'context/authContext';
import { useFormatDate } from 'hooks/useFormatDate';
import { useFetchAprobations } from 'lib/PQRS/fetchAprobations';
import { HeaderTable } from './HeaderTable';

const STATUS_QUERY = 'Pendiente aprobacion';

export const GetAprobaciones = () => {
  const { formatDate } = useFormatDate();
  const { diasHabiles } = useDiasHabiles();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const { fetchAprobationsStatus, fetchAssignAprobation, fetchChangeAprobation } = useFetchAprobations();

  const { data: aprobaciones = [], isLoading } = useQuery({
    queryKey: ['aprobations-status', STATUS_QUERY, user.departamento._id],
    queryFn: () => fetchAprobationsStatus(STATUS_QUERY, user.departamento._id)
  });

  const invalidateAprobaciones = () => {
    queryClient.invalidateQueries({ queryKey: ['aprobations-status'] });
  };

  const mutationAssign = useMutation({
    mutationFn: fetchAssignAprobation,
    onSuccess: () => {
      toast.success('Aprobación asignada correctamente');
      resetSelection();
      invalidateAprobaciones();
    }
  });

  const mutationReassign = useMutation({
    mutationFn: fetchChangeAprobation,
    onSuccess: () => {
      toast.success('Aprobación reasignada correctamente');
      resetSelection();
      invalidateAprobaciones();
    }
  });

  const resetSelection = useCallback(() => {
    setSelectedRows([]);
    setSelectedUser(null);
  }, []);

  const handleGlobalFilter = useCallback((e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value }
    }));
  }, []);

  const handleAssign = useCallback(() => {
    if (!selectedUser) return toast.error('Seleccione un usuario');
    const data = selectedRows.map(({ _id }) => ({
      _id,
      id_usuario: selectedUser._id
    }));
    mutationAssign.mutate(data);
  }, [selectedRows, selectedUser, mutationAssign]);

  const handleReassign = useCallback(() => {
    if (!selectedUser) return toast.error('Seleccione un usuario');
    const data = selectedRows.map((item) => ({
      _id: item._id,
      id_usuario: selectedUser._id,
      id_radicado: item.id_radicado,
      usuario_envia: item.usuario_envia._id,
      id_departamento: item.departamento._id
    }));
    mutationReassign.mutate(data);
  }, [selectedRows, selectedUser, mutationReassign]);

  const confirmAssign = useCallback(() => {
    confirmDialog({
      message: '¿Está seguro de realizar la asignación?',
      header: 'Confirmar aprobación',
      icon: <WarningIcon className="text-red-500" />,
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'px-4 ml-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600',
      rejectClassName: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600',
      accept: handleAssign,
      reject: () => toast.error('Aprobación cancelada')
    });
  }, [handleAssign]);

  const confirmReassigned = useCallback(() => {
    confirmDialog({
      message: '¿Está seguro de realizar la reasignación?',
      header: 'Confirmar aprobación',
      icon: <WarningIcon className="text-red-500" />,
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'px-4 ml-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600',
      rejectClassName: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600',
      accept: handleReassign,
      reject: () => toast.error('Aprobación cancelada')
    });
  }, [handleReassign]);

  const getDiasLaborablesClass = useCallback(
    (dias) =>
      classNames('rounded-full flex justify-center items-center text-center font-bold w-8 h-8', {
        'bg-green-500 text-black': dias <= 5,
        'bg-yellow-500 text-black': dias >= 6 && dias <= 9,
        'bg-orange-500 text-black': dias >= 10 && dias <= 12,
        'bg-red-500 text-black': dias >= 13
      }),
    []
  );

  const renderDiasLaborables = useCallback(
    (row) => {
      const dias = diasHabiles(row.fecha_radicado);
      return <div className={getDiasLaborablesClass(dias)}>{dias}</div>;
    },
    [diasHabiles, getDiasLaborablesClass]
  );

  const renderResponsable = useCallback((row) => {
    const responsable = row.usuario_responsable || 'Sin asignar';
    const unassigned = !row.usuario_responsable;

    return (
      <span className="relative inline-flex">
        <p>{responsable}</p>
        {unassigned && (
          <span className="absolute -top-2 -right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )}
      </span>
    );
  }, []);

  const header = useMemo(() => {
    const searchValue = filters.global?.value || '';

    return (
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <InputText type="search" value={searchValue} onChange={handleGlobalFilter} placeholder="Buscar" />

        <HeaderTable selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

        <div className="flex gap-2">
          <button
            className="py-1 px-3 bg-[#289535] text-white text-sm font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
            onClick={confirmAssign}
            disabled={!selectedRows.length || !selectedUser || mutationAssign.isLoading}
          >
            Asignar
          </button>

          <button
            className="py-1 px-3 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={confirmReassigned}
            disabled={!selectedRows.length || !selectedUser || mutationAssign.isLoading}
          >
            Reasignar
          </button>
        </div>
      </div>
    );
  }, [filters, handleGlobalFilter, selectedUser, confirmAssign, confirmReassigned, mutationAssign.isLoading, selectedRows.length]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <ConfirmDialog />
      <Toaster position="top-right" richColors />
      {header}
      <DataTable
        value={aprobaciones}
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
        <Column field="fecha_radicado" header="Fecha radicado" body={(r) => formatDate(r.fecha_radicado)} sortable />
        <Column field="asunto" header="Asunto" />
        <Column field="id_usuario" header="Responsable" body={renderResponsable} />
        <Column field="usuario_envia.username" header="Usuario envía" />
        <Column field="fecha_asignacion" header="Fecha asignación" body={(r) => formatDate(r.fecha_asignacion) || 'Sin asignar'} />
        <Column field="fecha_radicado" header="Días" body={renderDiasLaborables} sortable />
      </DataTable>
    </div>
  );
};
