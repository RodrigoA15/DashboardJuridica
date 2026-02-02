import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useMutation } from '@tanstack/react-query';
import { useFetchQX } from 'lib/QX/fetchQX';
import { useFormatDate } from 'hooks/useFormatDate';
import { useFetchTemplates } from 'lib/Templates/fetchTemplates';
import { toast } from 'sonner';
import { useAuth } from 'context/authContext';

export const ModalTemplateAudiences = ({ open, close, asignaciones }) => {
  const [selected, setSelected] = useState([]);
  const [identification, setIdentification] = useState('');
  const [dataComparendo, setDataComparendo] = useState(null);
  const { generateTemplateAudiences } = useFetchTemplates();
  const { searchUserIdAudiences } = useFetchQX();
  const { formatDate } = useFormatDate();
  const { user } = useAuth();

  useEffect(() => {
    if (asignaciones?.numero_identificacion) {
      setIdentification(asignaciones.numero_identificacion);
    }
  }, [asignaciones]);

  const mutation = useMutation({
    mutationFn: (id) => searchUserIdAudiences(id),
    onSuccess: (data) => {
      const result = Array.isArray(data) ? data : [data];
      setDataComparendo(result);
      setSelected([]); // Limpiar selección previa al buscar nuevo
    },
    onError: (error) => {
      console.error('Error al buscar identificación:', error);
      setDataComparendo(null);
    }
  });
  const mutationGenerateDoc = useMutation({
    mutationFn: (payload) => generateTemplateAudiences(payload),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = asignaciones?.numero_radicado
        ? `Respuesta_Radicado_${asignaciones.numero_radicado}.docx`
        : 'Plantilla_Audiencia.docx';

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: async (error) => {
      let mensajeError = 'Error desconocido';

      // Si el error viene en un Blob (por el responseType: 'blob')
      if (error.response?.data instanceof Blob) {
        // Leemos el contenido del blob como texto
        const texto = await error.response.data.text();
        const parsed = JSON.parse(texto);
        mensajeError = parsed.message || mensajeError;
      } else {
        mensajeError = error.response?.data?.message || error.message;
      }
      // Aquí puedes usar un Toast de PrimeReact para mostrar el error real
      toast.error(mensajeError);
    }
  });

  const handleSearch = () => {
    if (identification) {
      mutation.mutate(identification);
    }
  };

  const infoUsuario = dataComparendo && dataComparendo.length > 0 ? dataComparendo[0] : null;

  // Header del Modal con Icono
  const headerTemplate = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi- folder-open text-primary" style={{ fontSize: '1.2rem' }}></i>
      <span className="font-bold">Plantilla de Audiencias</span>
    </div>
  );

  const handleDownload = () => {
    if (selected.length === 0) return;

    const dataUnificada = selected.map((comparendo) => ({
      ...comparendo,
      N_RADICADO: asignaciones?.numero_radicado,
      F_RADICADO: formatDate(asignaciones?.fecha_radicado),
      F_ACTUAL: formatDate(new Date()),
      USUARIO_QX: user?.username
    }));

    mutationGenerateDoc.mutate({ data: dataUnificada });
  };

  return (
    <Dialog
      header={headerTemplate}
      visible={open}
      style={{ width: '65vw' }}
      breakpoints={{ '960px': '85vw', '641px': '100vw' }}
      onHide={() => {
        setDataComparendo(null);
        close();
      }}
      className="p-fluid"
    >
      {/* SECCIÓN DE BÚSQUEDA */}
      <div className="flex justify-content-center mb-4">
        <div className="p-inputgroup w-48">
          <InputText
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
            placeholder="Número de Identificación"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            label={mutation.isPending ? 'Buscando...' : 'Buscar'}
            icon={mutation.isPending ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
            onClick={handleSearch}
            disabled={mutation.isPending || !identification}
          />
        </div>
      </div>

      {mutation.isError && (
        <small className="p-error block text-center mb-3">No se encontró información para la identificación proporcionada.</small>
      )}

      {/* INFORMACIÓN DEL CIUDADANO */}
      {infoUsuario && (
        <div className="surface-ground p-3 border-round-lg border-1 border-200 mb-4">
          <div className="p-4 bg-white border-l-4 border-blue-600 shadow-sm rounded-r-lg">
            <h3 className="text-sm font-bold text-blue-800 mb-2 uppercase flex align-items-center gap-2">
              <i className="pi pi-user"></i> Datos del usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <p className="text-sm">
                <strong>Nombre:</strong> {infoUsuario.NOMBRES} {infoUsuario.APELLIDOS}
              </p>
              <p className="text-sm">
                <strong>Identificación:</strong> {infoUsuario.ID_USUARIO}
              </p>
              <p className="text-sm">
                <strong>Dirección:</strong> {infoUsuario.DIRECCION || 'N/A'}
              </p>
              <p className="text-sm">
                <strong>Celular:</strong>{' '}
                {infoUsuario.CELULAR !== null && infoUsuario.CELULAR !== '000000' ? infoUsuario.CELULAR : infoUsuario.TELEFONO}
              </p>
            </div>
          </div>
        </div>
      )}

      <Divider align="left">
        <span className="p-tag p-tag-info">Resultados de Comparendos</span>
      </Divider>

      {/* TABLA DE RESULTADOS */}
      <DataTable
        value={dataComparendo}
        removableSort
        selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        dataKey="NRO_COMPARENDO"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        className="p-datatable-sm mt-2"
        emptyMessage="Realice una búsqueda para ver los resultados."
        tableStyle={{ minWidth: '50rem' }}
        stripedRows
        selectionPageOnly
        size="small"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="NRO_COMPARENDO" header="N° Comparendo" sortable />
        <Column field="FECHA" header="Fecha Comp." body={(rowData) => formatDate(rowData.FECHA)} sortable />
        <Column field="F_NOTIFICACION" header="Fecha Notificación" body={(rowData) => formatDate(rowData.F_NOTIFICACION)} sortable />
        <Column field="COD_INFRACCION" header="Infracción" className="font-bold text-primary" />
        <Column field="TIPO_FUENTE" header="Fuente" />
        <Column
          field="DESCRIPCION_ESTADO"
          header="Estado"
          body={(rowData) => <span className={`p-tag p-tag-warning`}>{rowData.DESCRIPCION_ESTADO}</span>}
        />
        <Column field="DIASHABILESCOMP" header="Días Hábiles" textAlign="center" />
        <Column field="DIASHABILESFN" header="Días Hábiles FN" textAlign="center" />
      </DataTable>

      {/* FOOTER OPCIONAL */}
      <div className="flex justify-content-end gap-2 mt-4">
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={close} />
        <Button
          label="Generar Plantilla (.docx)"
          icon={mutationGenerateDoc.isPending ? 'Generando...' : 'Generado'}
          className="p-button-help"
          onClick={handleDownload}
          disabled={mutationGenerateDoc.isPending || selected.length === 0}
        />
      </div>
    </Dialog>
  );
};

ModalTemplateAudiences.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  asignaciones: PropTypes.object
};
