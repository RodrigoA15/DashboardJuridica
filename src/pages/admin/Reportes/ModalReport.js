import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { useMutation } from '@tanstack/react-query';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { useFetchReport } from 'lib/admin/fetchReport';
// Importa PrimeReact Toast para notificaciones (si lo usas)
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const secondaryActiveClasses = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400';
const baseButtonClasses =
  'w-full py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 whitespace-nowrap flex items-center justify-center';

export const ModalReport = () => {
  // Estados
  const [visible, setVisible] = useState(false);
  const [dates, setDates] = useState(null);
  const { generateReport } = useFetchReport();
  const toast = useRef(null); // Ref para el Toast

  // 2. Definición del useMutation - Ajuste en onSuccess
  const mutation = useMutation({
    mutationFn: (data) => generateReport(data),
    onSuccess: (response) => {
      // 1. Obtener el Blob (el contenido binario del PDF)
      const blob = response.data;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'reporte_pqrs.pdf';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Opcional: Si quieres ser estricto con el tipo de contenido (Mime Type)
      // aunque el blob ya debe tener el tipo correcto (application/pdf)
      // const file = new Blob([blob], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);

      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Reporte PDF generado y descargado correctamente.',
        life: 3000
      });

      setVisible(false);
      setDates(null);
    }
  });

  const handleGenerateReport = () => {
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      const [startDateObj, endDateObj] = dates;

      const startDate = startDateObj.toISOString().split('T')[0];
      const endDate = endDateObj.toISOString().split('T')[0];

      mutation.mutate({ startDate, endDate });
    } else {
      toast.current.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, selecciona un rango de fechas completo.',
        life: 3000
      });
    }
  };

  const dialogFooter = (
    <div className="flex justify-content-end pt-3">
      <Button
        label="Cancelar"
        onClick={() => {
          setVisible(false);
          setDates(null);
          mutation.reset();
        }}
        className="p-button-text"
        disabled={mutation.isPending}
      />
      <Button
        label={mutation.isPending ? 'Generando...' : 'Generar'}
        onClick={handleGenerateReport}
        autoFocus
        loading={mutation.isPending}
        // Deshabilitar si no hay fechas completas o si está cargando
        disabled={!dates || dates.length !== 2 || !dates[0] || !dates[1] || mutation.isPending}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <div>
        <button className={`${secondaryActiveClasses} ${baseButtonClasses}`} onClick={() => setVisible(true)}>
          <span className="mr-2" role="img" aria-label="reporte-emoji">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-file-analytics"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
              <path d="M9 17l0 -5" />
              <path d="M12 17l0 -1" />
              <path d="M15 17l0 -3" />
            </svg>
          </span>
          Generar reporte
        </button>

        {/* Diálogo */}
        <Dialog
          header="Generar reporte"
          visible={visible}
          position="top"
          style={{ width: '25vw', marginTop: '45px' }}
          footer={dialogFooter}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
            setDates(null);
            mutation.reset();
          }}
        >
          <div className="card flex justify-content-center flex-column gap-3">
            <FloatLabel>
              <Calendar
                inputId="range_date"
                value={dates}
                onChange={(e) => setDates(e.value)}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
                className="border-2 rounded-md"
                showIcon
                maxDate={new Date()}
              />
              <label htmlFor="range_date">Seleccione rango de fechas</label>
            </FloatLabel>
          </div>
        </Dialog>
      </div>
    </>
  );
};
