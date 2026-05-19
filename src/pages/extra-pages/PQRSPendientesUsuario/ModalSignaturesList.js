import { useRef } from 'react';
import { useBadge } from 'hooks/Badge';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import { useFetchAnswers } from 'lib/PQRS/fetchAnswers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormatDate } from 'hooks/useFormatDate';
import { FileUpload } from 'primereact/fileupload';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const REQUIRED_SIGNATURE = 'S';
const SIGNATURE_STATUS = 'PENDIENTE';

export const ModalSignaturesList = ({ open, close, assignmentData }) => {
  const fileUploadRef = useRef(null);
  const { formatDate } = useFormatDate();
  const { renderDiasLaborables } = useBadge();
  const { fetchSignaturesByStatus, fetchUpdateAnswerSignature } = useFetchAnswers();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['signatures-status', assignmentData?._id, REQUIRED_SIGNATURE, SIGNATURE_STATUS],
    queryFn: () => fetchSignaturesByStatus(assignmentData?._id, REQUIRED_SIGNATURE, SIGNATURE_STATUS),
    enabled: open && !!assignmentData?._id
  });

  const { mutate: updateSignatureStatus } = useMutation({
    mutationFn: ({ id, payload }) => fetchUpdateAnswerSignature(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['signatures-status', assignmentData?._id, REQUIRED_SIGNATURE, SIGNATURE_STATUS]
      });
      fileUploadRef.current?.clear();
    },
    onError: (error) => {
      console.error('Error actualizando firma:', error);
    }
  });

  const chooseOptions = {
    icon: <AddIcon fontSize="small" />,
    className: 'p-button-rounded p-button-text p-button-secondary',
    label: 'Agregar'
  };

  const uploadOptions = {
    icon: <UploadFileIcon fontSize="small" />,
    className: 'p-button-rounded p-button-success p-button-text',
    label: 'Subir'
  };

  const cancelOptions = {
    icon: <CloseIcon fontSize="small" />,
    className: 'p-button-rounded p-button-danger p-button-text',
    label: 'Cancelar'
  };

  const itemTemplate = (item) => {
    const fecha_solicitud_firma = {
      fecha_radicado: item.fecha_solicitud_firma
    };

    const onCustomUpload = async (event) => {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('id_asignacion', item?.id_asignacion);
      formData.append('id_radicado', assignmentData?.id_radicado);
      formData.append('respuesta_pdf', file);

      updateSignatureStatus(
        { id: item?._id, payload: formData },
        {
          onSuccess: () => {
            if (event.options && event.options.clear) {
              event.options.clear();
            }
          }
        }
      );
    };

    const headerTemplate = (options) => {
      const { className, chooseButton, uploadButton, cancelButton } = options;

      return (
        <div className={className + ' flex items-center gap-2 p-2 bg-transparent border-none'}>
          {chooseButton}
          {uploadButton}
          {cancelButton}
          <span className="ml-auto text-xs text-gray-400 italic">{renderDiasLaborables(fecha_solicitud_firma)}</span>
        </div>
      );
    };

    return (
      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Información Principal */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Respuesta Radicado
              </span>
              <span className="font-mono text-gray-800 font-bold">{item.numero_radicado_respuesta}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium mr-2">Fecha solicitud firma:</span>
              <span>{formatDate(item.fecha_solicitud_firma)}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <FileUpload
              ref={fileUploadRef}
              name="demo[]"
              url="/api/upload"
              accept=".pdf"
              maxFileSize={1000000}
              mode="advanced"
              headerTemplate={headerTemplate}
              chooseOptions={chooseOptions}
              uploadOptions={uploadOptions}
              cancelOptions={cancelOptions}
              contentClassName="p-0 border-none"
              customUpload
              uploadHandler={onCustomUpload}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      header="Firmas pendientes"
      visible={open}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      onHide={() => {
        if (!open) return;
        close();
      }}
    >
      <div className="card">
        {isLoading ? (
          <div className="p-4 text-center">Cargando firmas...</div>
        ) : (
          <DataView value={data || []} itemTemplate={itemTemplate} />
        )}
      </div>
    </Dialog>
  );
};
