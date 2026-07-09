import { useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';

// Iconos y UI
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Tooltip, CircularProgress } from '@mui/material'; // Añadido CircularProgress

import axios from 'api/axios';
import { useFormatDate } from 'hooks/useFormatDate';
import { useBadge } from 'hooks/Badge';

const MySwal = withReactContent(Swal);
const STATUS_PENDIENTE_FIRMA = 'Pendiente firma';

export const TablePendingUser = ({
  asignados,
  setAsignados,
  error,
  setOpenReasignacion,
  setSelectedData,
  setVisible,
  setSelectedRespuesta,
  setOpenRespuestasModal,
  setSelectedAsignacion,
  setSelectedDataAudiences,
  setVisibleTA,
  setVisibleSignatures,
  setSelectedSignatureRow
}) => {
  const { formatDate } = useFormatDate();
  const { renderDiasLaborables } = useBadge();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // Nuevo estado para controlar qué fila se está validando
  const [validatingRowId, setValidatingRowId] = useState(null);

  const checkAnswersStatus = async (rowData) => {
    try {
      const { _id: id_asignacion, numero_radicado } = rowData ?? {};
      if (!numero_radicado) {
        toast.error('Datos de radicado no válidos');
        return false;
      }
      const { data: validationQuantityAnswer } = await axios.get(`/answer/validation-quantity-answers/${numero_radicado}/${id_asignacion}`);

      if (validationQuantityAnswer.data.isValid) {
        await MySwal.fire({
          title: 'Esta petición tiene respuestas completas',
          text: 'Si necesita modificar algo, contacte al administrador.',
          icon: 'info',
          customClass: { container: 'swal-zindex' }
        });
        return false;
      }

      return true;
    } catch (err) {
      toast.error('Hubo un error al validar la informacion');
    }
  };

  const handleOpenAddAnswer = async (data) => {
    // 1. Prevenir múltiples clics
    if (validatingRowId) return;

    setValidatingRowId(data.id_radicado);

    try {
      const canAdd = await checkAnswersStatus(data);
      if (canAdd) {
        setSelectedData(data);
        setVisible(true);
      }
    } finally {
      setValidatingRowId(null);
    }
  };

  const handleOpenSignatures = (data) => {
    setVisibleSignatures(true);
    setSelectedSignatureRow(data);
  };

  const handleOpenViewAnswer = (data) => {
    setSelectedRespuesta(data);
    setOpenRespuestasModal(true);
  };

  const handleOpenReasignacion = (data) => {
    setSelectedAsignacion(data);
    setOpenReasignacion(true);
  };

  const handleOpenTemplate = (data) => {
    setSelectedDataAudiences(data);
    setVisibleTA(true);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } });
    setGlobalFilterValue(value);
  };

  const onRowEditComplete = async (e) => {
    const { newData } = e;

    if (newData.cantidad_respuesta <= 0) {
      toast.error('La cantidad de respuestas debe ser mayor a 0');
      e.preventDefault();
      return;
    }

    try {
      await axios.put(`/radicados/updateQuantity/${newData.id_radicado}`, {
        cantidad_respuesta: newData.cantidad_respuesta
      });

      // SOLUCIÓN AL BUG DE ITERACIÓN: Actualización condicional segura
      setAsignados((prevAsignados) => {
        // Caso 1: Es un arreglo plano
        if (Array.isArray(prevAsignados)) {
          return prevAsignados.map((item) => (item.id_radicado === newData.id_radicado ? newData : item));
        }

        // Caso 2: Es un objeto paginado (ej: { data: [...] })
        if (prevAsignados?.data && Array.isArray(prevAsignados.data)) {
          return {
            ...prevAsignados,
            data: prevAsignados.data.map((item) => (item.id_radicado === newData.id_radicado ? newData : item))
          };
        }

        // Fallback de seguridad
        return prevAsignados;
      });

      toast.success('Cantidad respuesta actualizada.');
    } catch (err) {
      toast.error('Error al actualizar el registro');
      e.preventDefault();
    }
  };

  const statusBodyTemplate = (rowData) => {
    const isPending = rowData.estado_radicado === STATUS_PENDIENTE_FIRMA;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${isPending ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
      >
        {rowData.estado_radicado}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    const isRowLoading = validatingRowId === rowData.id_radicado;

    return (
      <div className="flex items-center justify-center gap-1">
        <Tooltip title={isRowLoading ? 'Validando...' : 'Agregar respuestas'} placement="top-start" arrow>
          <span>
            {' '}
            {/* El span envuelve para que Tooltip funcione en botones deshabilitados */}
            <IconButton
              onClick={() => handleOpenAddAnswer(rowData)}
              disabled={isRowLoading || validatingRowId !== null} // Deshabilita si ESTA fila carga, o si OTRA fila está cargando
            >
              {isRowLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Agregar información" placement="top-start" arrow>
          <span>
            <IconButton onClick={() => handleOpenSignatures(rowData)}>
              <EditNoteIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Ver respuestas" placement="top-start" arrow>
          <IconButton onClick={() => handleOpenViewAnswer(rowData)} disabled={validatingRowId !== null}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reasignación" placement="top-start" arrow>
          <IconButton onClick={() => handleOpenReasignacion(rowData)} disabled={validatingRowId !== null}>
            <SendIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Generar plantilla" placement="top" arrow>
          <IconButton onClick={() => handleOpenTemplate(rowData)} disabled={validatingRowId !== null}>
            <AutoAwesomeIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  // NUEVO DISEÑO DEL HEADER
  const renderHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 rounded-t-xl border-b border-gray-200">
      <div className="w-full md:w-auto relative">
        <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
        <InputText
          className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          type="search"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar radicado, asunto..."
        />
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* PrimeReact soporta la prop 'header', renderizamos el nuestro aquí */}
      <DataTable
        value={asignados?.data || asignados} // Renderizado seguro dependiendo del formato
        emptyMessage={error || 'No se encontraron registros pendientes'}
        stripedRows
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
        filters={filters}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        dataKey="id_radicado"
        header={renderHeader()}
      >
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="estado_radicado" header="Estado" body={statusBodyTemplate} sortable headerStyle={{ textAlign: 'center' }} />
        <Column field="fecha_radicado" sortable header="Fecha radicado" body={(rowData) => formatDate(rowData.fecha_radicado)} />
        <Column field="id_asunto" sortable header="Asunto" />
        <Column field="fecha_asignacion" sortable header="Fecha asignación" body={(rowData) => formatDate(rowData.fecha_asignacion)} />
        <Column field="nombre_procedencia" header="Procedencia" />
        <Column field="observaciones" header="Observaciones" />

        <Column
          field="cantidad_respuesta"
          sortable
          header="Respuestas estimadas"
          editor={(options) => (
            <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} className="w-full" />
          )}
        />

        <Column field="fecha_radicado" sortable header="Dias" body={renderDiasLaborables} />
        <Column header="Acciones" body={actionBodyTemplate} headerStyle={{ textAlign: 'center', minWidth: '12rem' }} />
        <Column
          rowEditor={(rowData) => rowData.cantidad_respuesta !== 'Blue Band'}
          headerStyle={{ width: '6%', minWidth: '4rem' }}
          bodyStyle={{ textAlign: 'center' }}
        />
      </DataTable>
    </div>
  );
};

TablePendingUser.propTypes = {
  asignados: PropTypes.oneOfType([PropTypes.array, PropTypes.object]), // Actualizado para soportar objetos
  setAsignados: PropTypes.func,
  error: PropTypes.string,
  setOpenReasignacion: PropTypes.func,
  setSelectedData: PropTypes.func,
  setVisible: PropTypes.func,
  handleClose: PropTypes.func,
  setSelectedRespuesta: PropTypes.func,
  setOpenRespuestasModal: PropTypes.func,
  setSelectedAsignacion: PropTypes.func,
  setSelectedDataAudiences: PropTypes.func,
  setVisibleTA: PropTypes.func
};
