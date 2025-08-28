import { useState } from 'react';
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
import { classNames } from 'primereact/utils';
//Api functions
import axios from 'api/axios';
import { AllAnswers, AnswersByArea, AnswersByUser } from '../Totals';
//Hooks
import { useFormatDate } from 'hooks/useFormatDate';
import useDiasHabiles from 'hooks/useDate';

export const TablePendingUser = ({
  asignados,
  setAsignados,
  error,
  setOpenReasignacion,
  setSelectedData,
  setOpenModal,
  handleClose,
  setSelectedRespuesta,
  setOpenRespuestasModal,
  setSelectedAsignacion
}) => {
  const { formatDate } = useFormatDate();
  const { diasHabiles } = useDiasHabiles();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  let MySwal = withReactContent(Swal);

  //TODO colores de las alertas por dia habil
  const getBackgroundColor = (data) => {
    const diasLaborables = diasHabiles(data.fecha_radicado);

    const hola = classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'bg-success bg-gradient text-dark': diasLaborables <= 5,
      'bg-warning text-dark-900': diasLaborables >= 6 && diasLaborables <= 9,
      'dias text-dark': diasLaborables >= 10 && diasLaborables <= 12,
      'bg-danger bg-gradient text-dark': diasLaborables >= 13
    });

    return <div className={hola}>{diasLaborables}</div>;
  };

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpenModal(true);
    answersByUser(data);
  };

  const handleOpenR = (respuesta) => {
    setSelectedRespuesta(respuesta);
    setOpenRespuestasModal(true);
  };

  //TODO modal reasignaciones
  const handleOpenReasignacion = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setOpenReasignacion(true);
  };

  //SEARCH
  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const answersByUser = async (data) => {
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
  };

  const updateQuantityAnswers = async (data) => {
    try {
      if (data.cantidad_respuesta > 0) {
        await axios.put(`/radicados/updateQuantity/${data.id_radicado}`, {
          cantidad_respuesta: data.cantidad_respuesta
        });
      } else {
        toast.error('La cantidad de respuestas debe ser mayor a 0');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onRowEditComplete = (e) => {
    let _products = [...asignados];
    let { newData, index } = e;

    updateQuantityAnswers(newData);
    _products[index] = newData;
    setAsignados(_products);
  };

  const allowEdit = (rowData) => {
    return rowData.name !== 'Blue Band';
  };

  const quantityAnswers = (options) => {
    return <InputNumber className="w-72" value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const renderHeader = () => {
    return (
      <>
        <div className="row">
          <div className="col-3">
            <InputText
              className="inputUser"
              type="search"
              value={globalFilterValue}
              onChange={(e) => onGlobalFilterChange(e)}
              placeholder="Buscar"
            />
          </div>
          <div className="col-3">
            <AnswersByUser />
          </div>
          <div className="col-3">
            <AllAnswers />
          </div>
          <div className="col-3">
            <AnswersByArea />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();

  //Buttons
  const btnOpenModalAddAnswer = (data) => {
    return (
      <Tooltip title="Agregar respuestas" placement="top-start" arrow>
        <IconButton onClick={() => handleOpen(data)}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    );
  };
  const btnOpenModalViewAnswer = (data) => {
    return (
      <Tooltip title="Ver respuestas" placement="top-start" arrow>
        <IconButton onClick={() => handleOpenR(data)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    );
  };
  const btnReasignation = (data) => {
    return (
      <Tooltip title="Reasignación" placement="top-start" arrow>
        <IconButton onClick={() => handleOpenReasignacion(data)}>
          <SendIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <>
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
        header={header}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
      >
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="fecha_radicado" sortable header="Fecha radicado" body={(rowData) => formatDate(rowData.fecha_radicado)} />
        <Column field="id_asunto" sortable header="Asunto" />
        <Column field="fecha_asignacion" sortable header="Fecha asignación" body={(rowData) => formatDate(rowData.fecha_asignacion)} />
        <Column field="nombre_procedencia" header="Procedencia" />
        <Column field="observaciones" header="Observaciones" />
        <Column field="cantidad_respuesta" sortable header="Respuestas estimadas" editor={(options) => quantityAnswers(options)} />
        <Column field="fecha_radicado" sortable header="Dias" body={getBackgroundColor} />
        <Column body={btnOpenModalAddAnswer} />
        <Column body={btnOpenModalViewAnswer} />
        <Column body={btnReasignation} />
        <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      </DataTable>
    </>
  );
};

TablePendingUser.propTypes = {
  asignados: PropTypes.array,
  setAsignados: PropTypes.func,
  error: PropTypes.string,
  setOpenReasignacion: PropTypes.func,
  setSelectedData: PropTypes.func,
  setOpenModal: PropTypes.func,
  handleClose: PropTypes.func,
  setSelectedRespuesta: PropTypes.func,
  setOpenRespuestasModal: PropTypes.func,
  setSelectedAsignacion: PropTypes.func
};
