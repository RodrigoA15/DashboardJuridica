// Importa useMemo y useCallback
import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
//Sweet Alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';
//icons
import { FilterMatchMode } from 'primereact/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Tooltip } from '@mui/material';
import { InputText } from 'primereact/inputtext';
//Api functions
import axios from 'api/axios';
//Hooks
import { useFormatDate } from 'hooks/useFormatDate';
import { useBadge } from 'hooks/Badge';

const MySwal = withReactContent(Swal);

export const TablePendingUser = ({
  asignados,
  setAsignados,
  error,
  setOpenReasignacion,
  setSelectedData,
  setVisible,
  handleClose,
  setSelectedRespuesta,
  setOpenRespuestasModal,
  setSelectedAsignacion
}) => {
  const { formatDate } = useFormatDate();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const { renderDiasLaborables } = useBadge();

  const answersByUser = useCallback(
    async (data) => {
      try {
        const { numero_radicado, cantidad_respuesta } = data ?? {};
        if (!numero_radicado) return toast.error('Datos de radicado no válidos');

        const { data: answers } = await axios.get(`/answer/radicados_respuestas/${numero_radicado}`);
        const cantidadRespuestasCargadas = answers?.length ?? 0;

        if (cantidadRespuestasCargadas === cantidad_respuesta) {
          MySwal.fire({
            title: 'Esta petición tiene una respuesta cargada',
            text: 'Por favor marque la petición como respuesta',
            icon: 'success',
            customClass: { container: 'swal-zindex' }
          }).then((alert) => {
            if (alert.isConfirmed) handleClose();
          });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error('No se encontraron respuestas cargadas');
        } else {
          toast.error('Ocurrió un error al cargar las respuestas');
        }
      }
    },
    [handleClose]
  );

  const updateQuantityAnswers = useCallback(async (data) => {
    if (data.cantidad_respuesta <= 0) {
      toast.error('La cantidad de respuestas debe ser mayor a 0');
      throw new Error('Cantidad de respuesta no válida');
    }

    await axios.put(`/radicados/updateQuantity/${data.id_radicado}`, {
      cantidad_respuesta: data.cantidad_respuesta
    });
  }, []);

  const handleOpen = useCallback(
    (data) => {
      setSelectedData(data);
      setVisible(true);
      answersByUser(data);
    },
    [setSelectedData, setVisible, answersByUser]
  );

  const handleOpenR = useCallback(
    (respuesta) => {
      setSelectedRespuesta(respuesta);
      setOpenRespuestasModal(true);
    },
    [setSelectedRespuesta, setOpenRespuestasModal]
  );

  const handleOpenReasignacion = useCallback(
    (asignacion) => {
      setSelectedAsignacion(asignacion);
      setOpenReasignacion(true);
    },
    [setSelectedAsignacion, setOpenReasignacion]
  );

  const onGlobalFilterChange = useCallback(
    (event) => {
      const value = event.target.value;
      let _filters = { ...filters };
      _filters['global'].value = value;
      setFilters(_filters);
      setGlobalFilterValue(value);
    },
    [filters]
  );

  const onRowEditComplete = useCallback(
    async (e) => {
      const { newData } = e;
      try {
        await updateQuantityAnswers(newData);

        setAsignados((prevAsignados) => prevAsignados.map((item) => (item.id_radicado === newData.id_radicado ? newData : item)));

        toast.success('Registro actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar:', error);
      }
    },
    [updateQuantityAnswers, setAsignados]
  );

  const allowEdit = (rowData) => {
    return rowData.cantidad_respuesta !== 'Blue Band';
  };

  const quantityAnswers = useCallback((options) => {
    return <InputNumber className="w-72" value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  }, []);

  const header = useMemo(() => {
    return (
      <div className="grid grid-cols-4 gap-4 mb-3">
        <div>
          <InputText className="inputUser" type="search" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
        </div>
      </div>
    );
  }, [globalFilterValue, onGlobalFilterChange]);

  const btnOpenModalAddAnswer = useCallback(
    (data) => {
      return (
        <Tooltip title="Agregar respuestas" placement="top-start" arrow>
          <IconButton onClick={() => handleOpen(data)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      );
    },
    [handleOpen]
  );

  const btnOpenModalViewAnswer = useCallback(
    (data) => {
      return (
        <Tooltip title="Ver respuestas" placement="top-start" arrow>
          <IconButton onClick={() => handleOpenR(data)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      );
    },
    [handleOpenR]
  );

  const btnReasignation = useCallback(
    (data) => {
      return (
        <Tooltip title="Reasignación" placement="top-start" arrow>
          <IconButton onClick={() => handleOpenReasignacion(data)}>
            <SendIcon />
          </IconButton>
        </Tooltip>
      );
    },
    [handleOpenReasignacion]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {header}
      <DataTable
        value={asignados}
        emptyMessage={error}
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
      >
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="fecha_radicado" sortable header="Fecha radicado" body={(rowData) => formatDate(rowData.fecha_radicado)} />
        <Column field="id_asunto" sortable header="Asunto" />
        <Column field="fecha_asignacion" sortable header="Fecha asignación" body={(rowData) => formatDate(rowData.fecha_asignacion)} />
        <Column field="nombre_procedencia" header="Procedencia" />
        <Column field="observaciones" header="Observaciones" />
        <Column field="cantidad_respuesta" sortable header="Respuestas estimadas" editor={quantityAnswers} />
        <Column field="fecha_radicado" sortable header="Dias" body={renderDiasLaborables} />
        <Column body={btnOpenModalAddAnswer} />
        <Column body={btnOpenModalViewAnswer} />
        <Column body={btnReasignation} />
        <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      </DataTable>
    </div>
  );
};

TablePendingUser.propTypes = {
  asignados: PropTypes.array,
  setAsignados: PropTypes.func,
  error: PropTypes.string,
  setOpenReasignacion: PropTypes.func,
  setSelectedData: PropTypes.func,
  setVisible: PropTypes.func,
  handleClose: PropTypes.func,
  setSelectedRespuesta: PropTypes.func,
  setOpenRespuestasModal: PropTypes.func,
  setSelectedAsignacion: PropTypes.func
};
