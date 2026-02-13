import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import WarningIcon from '@mui/icons-material/Warning';
import { InputTextarea } from 'primereact/inputtextarea';
import { confirmDialog } from 'primereact/confirmdialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'context/authContext';
import { SelectAreas } from 'components/select/selectAreas';
import { useFetchPendientes } from 'lib/PQRS/fetchPendientes';
import { useRecord } from 'hooks/useRecord';

const QUERY_KEY = ['radicados-pendientes'];
const MODIFY_DATE = new Date();

export const Reject = ({ selectedData, setSelected }) => {
  const { user } = useAuth();
  const { insertRecords } = useRecord();
  const [visible, setVisible] = useState(false);
  const [observation, setObservation] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const { fetchUpdateRadicados } = useFetchPendientes();

  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async (variables) => {
      const { areaId } = variables;
      const payload = selectedData.map(({ _id }) => ({
        _id,
        id_departamento: areaId
      }));

      await fetchUpdateRadicados(payload);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const deptIds = user.departamento.map((d) => d._id);
      const keyByDept = [...QUERY_KEY, deptIds];
      const previousData = queryClient.getQueryData(keyByDept);
      queryClient.setQueryData(keyByDept, (oldData = []) => {
        if (!oldData) return [];

        const selectedIds = new Set(selectedData.map(({ _id }) => _id));
        return oldData.filter(({ _id }) => !selectedIds.has(_id));
      });

      return { previousData, keyByDept };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.keyByDept, context.previousData);
      }
    },

    onSuccess: async () => {
      await insertRecords(
        selectedData.map((item) => ({
          id_radicado: item._id,
          observacion: `El usuario ${user.username} reasigno  el radicado ${item.numero_radicado} por motivo de ${observation}`,
          id_usuario: user._id,
          fecha_modifica: MODIFY_DATE
        }))
      );
    },

    onSettled: (_, error, __, context) => {
      if (!error) {
        setSelected([]);
        setVisible(false);
        setObservation('');
        setSelectedArea(null);
        toast.success('Radicados reasignados con éxito.');
      }

      if (context?.keyByDept) {
        queryClient.invalidateQueries({ queryKey: context.keyByDept });
      }
    }
  });

  const handleConfirmAssign = useCallback(() => {
    confirmDialog({
      message: `¿Está seguro de que desea reasignar ${selectedData.length} radicado(s)?`,
      header: 'Confirmar Reasignaciones',
      icon: <WarningIcon className="text-red-500" />,
      acceptLabel: 'Sí, asignar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'px-4 ml-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700',
      rejectClassName: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600',

      accept: () =>
        updateStatus.mutate({
          areaId: selectedArea?._id,
          obs: observation
        }),
      reject: () => toast.error('Asignación cancelada')
    });
  }, [selectedData.length, updateStatus, observation, selectedArea]);

  const isDisabled = useMemo(
    () => selectedData.length === 0 || !observation || !selectedArea || updateStatus.isPending,
    [selectedData.length, updateStatus.isPending, observation, selectedArea]
  );

  return (
    <div>
      <button
        className="flex-shrink-0 px-5 py-2 border border-red-600 text-red-600 font-semibold rounded-lg 
                   hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setVisible(true)}
        disabled={selectedData.length === 0}
      >
        Rechazar
      </button>

      <Dialog
        header="Rechazar Asignación"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: '40vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <div className="flex flex-col gap-6 p-fluid pt-4">
          <SelectAreas selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
          <FloatLabel>
            <InputTextarea id="observation" value={observation} onChange={(e) => setObservation(e.target.value)} rows={5} />
            <label htmlFor="observation">Observaci&oacute;n</label>
          </FloatLabel>
          <button
            className="flex-shrink-0 px-5 py-2 border border-red-600 text-red-600 font-semibold rounded-lg 
                   hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirmAssign}
            disabled={isDisabled}
          >
            Reasignar
          </button>
        </div>
      </Dialog>
    </div>
  );
};

Reject.propTypes = {
  selectedData: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired
};
