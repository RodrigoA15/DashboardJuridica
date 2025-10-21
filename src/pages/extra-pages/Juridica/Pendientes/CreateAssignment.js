import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WarningIcon from '@mui/icons-material/Warning';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useAuth } from 'context/authContext';
import { useFetchAssignments } from 'lib/PQRS/fetchAssignments';

const STATUS_RADICADO = 'Asignados';
const STATUS_ASSIGNMENTS = 'abierto';
const QUERY_KEY = ['radicados-pendientes'];

export const CreateAssignment = ({ selectedData, setSelected }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { fetchCreateAssignments, fetchUpdateStatusRadicado } = useFetchAssignments();

  const assignAndUpdateMutation = useMutation({
    mutationFn: async (assignments) => {
      await fetchCreateAssignments(assignments);
      const radicadoIds = selectedData.map(({ _id }) => ({ _id, estado_radicado: STATUS_RADICADO }));
      await fetchUpdateStatusRadicado(radicadoIds);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const keyByDept = [...QUERY_KEY, user.departamento._id];

      const previousData = queryClient.getQueryData(keyByDept);

      queryClient.setQueryData(keyByDept, (oldData = []) => {
        const selectedIds = new Set(selectedData.map(({ _id }) => _id));
        return oldData.filter(({ _id }) => !selectedIds.has(_id));
      });

      return { previousData, keyByDept };
    },

    onError: (error, _, context) => {
      if (context?.previousData && context.keyByDept) {
        queryClient.setQueryData(context.keyByDept, context.previousData);
      }
      toast.error(`Ocurrió un error al asignar: ${error.message}`);
    },

    onSettled: (_, __, ___, context) => {
      setSelected([]);
      if (context?.keyByDept) queryClient.invalidateQueries({ queryKey: context.keyByDept });
    }
  });

  const buildAssignments = useCallback(
    () =>
      selectedData.map(({ _id }) => ({
        id_usuario: user._id,
        fecha_asignacion: new Date(),
        estado_asignacion: STATUS_ASSIGNMENTS,
        id_radicado: _id
      })),
    [selectedData, user._id]
  );
  const handleConfirmAssign = useCallback(() => {
    const newAssignments = buildAssignments();

    confirmDialog({
      message: `¿Está seguro de que desea asignar ${selectedData.length} radicado(s)?`,
      header: 'Confirmar Asignaciones',
      icon: <WarningIcon className="text-red-500" />,
      acceptLabel: 'Sí, asignar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'px-4 ml-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700',
      rejectClassName: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600',
      accept: () => assignAndUpdateMutation.mutate(newAssignments),
      reject: () => toast.error('Asignación cancelada')
    });
  }, [buildAssignments, selectedData.length, assignAndUpdateMutation]);

  const isDisabled = useMemo(
    () => selectedData.length === 0 || assignAndUpdateMutation.isPending,
    [selectedData.length, assignAndUpdateMutation.isPending]
  );

  return (
    <div>
      <ConfirmDialog />
      <Toaster position="top-right" richColors />
      <button
        className="flex-shrink-0 px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg 
                   hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleConfirmAssign}
        disabled={isDisabled}
      >
        {assignAndUpdateMutation.isPending ? 'Asignando...' : 'Asignar'}
      </button>
    </div>
  );
};

CreateAssignment.propTypes = {
  selectedData: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired
};
