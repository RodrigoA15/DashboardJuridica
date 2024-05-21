//Axios
import axios from 'api/axios';
//Prime react
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
//MaterialUI
import { Button } from '@mui/material';
//SweetAlert
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
//React
import { useEffect, useState } from 'react';
import { useAuth } from 'context/authContext';
//Sonner
import { Toaster, toast } from 'sonner';
import ModalReasignacion from './ModalReasignacion';

function Preasignaciones() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'id_asunto.nombre_asunto': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    numero_radicado: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    observaciones_radicado: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  });
  useEffect(() => {
    {
      user && getAllPreasignaciones();
    }

    const intervalId = setInterval(getAllPreasignaciones, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  //Abrir modal
  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };
  //Cerrar modal
  const handleClose = () => {
    setSelectedData([]);
    setOpen(false);
  };
  //Mostrar todas las peticiones pre-asignadas
  const getAllPreasignaciones = async () => {
    try {
      const response = await axios.get(`/radicadoState/${user.departamento._id}`);
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS preasignadas');
      } else {
        setError('Error de servidor');
      }
    }
  };
  //Actualizar a estado pendiente
  const updateStatePreasignacion = async (pre) => {
    const MySwal = withReactContent(Swal);

    const alert = await MySwal.fire({
      title: '¿Está seguro de aceptar esta petición?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar'
    });
    if (alert.isConfirmed) {
      try {
        await axios.put(`/radicados/radicadosPre/`, {
          _id: pre
        });
        toast.success('Petición aceptada correctamente');
      } catch (error) {
        console.error('Error al actualizar el estado de la petición:', error);
        toast.error('Error al aceptar la petición');
      }
    } else {
      toast.error('No se aceptó la petición');
    }
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

    //Input buscar, botones rechazar y aceptar
    return (
      <>
        <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Buscar" />
        {selectedData.length > 0 && (
          <>
            <Button className="card2 ml-5" size="small" variant="contained" onClick={() => updateStatePreasignacion(selectedData)}>
              Aceptar
            </Button>

            <Button className="card4 ms-3" size="small" variant="contained" onClick={() => handleOpen(selectedData)}>
              Rechazar
            </Button>
          </>
        )}
      </>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <Toaster richColors position="top-right" />
      <DataTable
        value={data}
        removableSort
        stripedRows
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        selection={selectedData}
        onSelectionChange={(e) => setSelectedData(e.value)}
        dataKey="_id"
        header={header}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        emptyMessage={error}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="numero_radicado" sortable header="Número radicado" />
        <Column field="fecha_radicado" dataType="number" style sortable header="Fecha radicado" />
        <Column field="id_asunto.nombre_asunto" header="Asunto" />
        <Column field="id_procedencia.correo" header="Correo" />
        <Column field="observaciones_radicado" header="Observaciones" />
        <Column field="id_departamento.nombre_departamento" header="Area" />
      </DataTable>
      <ModalReasignacion open={open} handleClose={handleClose} data={selectedData} />
    </div>
  );
}

export default Preasignaciones;
