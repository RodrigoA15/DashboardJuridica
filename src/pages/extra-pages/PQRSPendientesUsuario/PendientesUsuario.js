import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
//Componentes
import ModalRespuestas from './ModalRespuestas';
import ModalRadicadosRespuestas from './ModalRadicadosRespuestas';
import Reasignaciones from './Reasignaciones/Reasignaciones';
// //Sweet Alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';
//icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
// import EditIcon from '@mui/icons-material/Edit';
import useDiasHabiles from 'hooks/useDate';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { IconButton, Tooltip } from '@mui/material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { AllAnswers, AnswersByArea, AnswersByUser } from './Totals';
import { useFormatDate } from 'hooks/useFormatDate';

function PendientesUsuario() {
  const { user } = useAuth();
  const [asignados, setAsignados] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [openRespuestasModal, setOpenRespuestasModal] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState(null);
  const [error, setError] = useState('');
  //Modal Reasignacion
  const [openReasignacion, setOpenReasignacion] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  const { diasHabiles } = useDiasHabiles();
  const { formatDate } = useFormatDate();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'id_usuario.username': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  });

  useEffect(() => {
    {
      user && apiDataUser();
    }
  }, [user]);

  let MySwal = withReactContent(Swal);

  //TODO consumo de api asignaciones
  const apiDataUser = async () => {
    try {
      const response = await axios.get(`/assigned/users/${user._id}`);
      setAsignados(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS asignadas');
      }
    }
  };

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpenModal(true);
    answersByUser(data);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpenModal(false);
  };

  const handleOpenR = (respuesta) => {
    setSelectedRespuesta(respuesta);
    setOpenRespuestasModal(true);
  };

  const handleCloseR = () => {
    setSelectedRespuesta(null);
    setOpenRespuestasModal(false);
  };

  //TODO modal reasignaciones
  const handleOpenReasignacion = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setOpenReasignacion(true);
  };

  const handleCloseReasignacion = () => {
    setSelectedAsignacion(null);
    setOpenReasignacion(false);
  };

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

  //Buscador
  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
  };
  const renderHeader = () => {
    const value = filters['global'] ? filters['global'].value : '';

    return (
      <>
        <div className="row">
          <div className="col-3">
            <InputText
              className="inputUser"
              type="search"
              value={value || ''}
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

  return (
    <div className="card">
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
      >
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="fecha_radicado" sortable header="Fecha radicado" body={(rowData) => formatDate(rowData.fecha_radicado)} />
        <Column field="id_asunto" sortable header="Asunto" />
        <Column field="fecha_asignacion" sortable header="Fecha asignación" body={(rowData) => formatDate(rowData.fecha_asignacion)} />
        <Column field="nombre_procedencia" header="Procedencia" />
        <Column field="observaciones" header="Observaciones" />
        <Column field="cantidad_respuesta" sortable header="Respuestas estimadas" />
        <Column field="fecha_radicado" sortable header="Dias" body={getBackgroundColor} />
        <Column body={btnOpenModalAddAnswer} />
        <Column body={btnOpenModalViewAnswer} />
        <Column body={btnReasignation} />
      </DataTable>
      <ModalRespuestas open={openModal} handleClose={handleClose} data={selectedData} setAsignados={setAsignados} asignados={asignados} />
      <ModalRadicadosRespuestas
        setAsignados={setAsignados}
        asignados={asignados}
        opens={openRespuestasModal}
        handleCloses={handleCloseR}
        respuestas={selectedRespuesta}
      />
      <Reasignaciones open={openReasignacion} close={handleCloseReasignacion} asignaciones={selectedAsignacion} />
    </div>
  );
}

export default PendientesUsuario;
