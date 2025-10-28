import { toast } from 'sonner';
import { Dialog } from 'primereact/dialog';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import WarningIcon from '@mui/icons-material/Warning';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useFetchLegalEntities } from 'lib/LegalEntity/fetchLegalEntities';
import Cities from './cities';

export const ModalCreateLegal = () => {
  const [visible, setVisible] = useState(false);
  const [nameEntity, setNameEntity] = useState('');
  const [municipio, setMunicipio] = useState('');
  const { fetchCreateLegal } = useFetchLegalEntities();

  const mutation = useMutation({
    mutationFn: (sendData) => fetchCreateLegal(sendData),
    onSuccess: () => {
      setVisible(false);
      setMunicipio('');
      setNameEntity('');
      toast.success('Ente jurídico creado correctamente');
    },

    onError: () => {
      toast.error('Error al crear el ente jurídico. Intente de nuevo.');
    }
  });

  const handleConfirmAssign = useCallback(() => {
    confirmDialog({
      message: `¿Está seguro de crear el ente jurídico?`,
      header: 'Confirmar Asignaciones',
      icon: <WarningIcon className="text-red-500" />,
      acceptLabel: 'Sí, crear',
      rejectLabel: 'Cancelar',
      acceptClassName: 'px-4 ml-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700',
      rejectClassName: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600',
      accept: () => mutation.mutate({ desc_ente_juridico: nameEntity, municipio: municipio.label }),
      reject: () => toast.error('Asignación cancelada')
    });
  }, [mutation, municipio, nameEntity]);

  const isFormInvalid = !nameEntity || !municipio;

  return (
    <div className="card flex justify-content-center">
      <ConfirmDialog />
      <button
        className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={() => setVisible(true)}
      >
        Crear
      </button>
      <Dialog
        header="Crear ente jurídico"
        visible={visible}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
          setNameEntity('');
          setMunicipio('');
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-600 mb-2">
              Nombre ente juridico
            </label>
            <input
              id="nombre"
              type="text"
              className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nameEntity}
              onChange={(e) => setNameEntity(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-600 mb-2">
              Ciudad
            </label>
            <Cities setMunicipio={setMunicipio} municipio={municipio} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-200">
          <button
            className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleConfirmAssign()}
            disabled={isFormInvalid || mutation.isPending}
          >
            Crear
          </button>
        </div>
      </Dialog>
    </div>
  );
};
