import axios from 'api/axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from '@mui/material';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useAuth } from 'context/authContext';
import { Toaster, toast } from 'sonner';
import ModalReasignacion from './ModalReasignacion';

function Preasignaciones() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  useEffect(() => {
    if (user) {
      getAllPreasignaciones();
    }
  }, [user]);

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedData([]);
    setOpen(false);
  };

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

  const updateStatePreasignacion = async (preData) => {
    const MySwal = withReactContent(Swal);

    const alert = await MySwal.fire({
      title: '¿Está seguro de aceptar estas peticiones?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar'
    });

    if (alert.isConfirmed) {
      try {
        // Ejecuta todas las solicitudes PUT en paralelo
        const updatePromises = preData.map((pre) => axios.put(`/radicados/radicadosPre/`, { _id: pre._id }));
        await Promise.all(updatePromises);
        // Crea un Set con los IDs actualizados para un filtrado más eficiente
        const updatedIds = new Set(preData.map((pre) => pre._id));
        // Filtra los elementos actualizados fuera de la lista de manera eficiente
        const nuevaData = data.filter((item) => !updatedIds.has(item._id));
        setData(nuevaData);
        toast.success('Peticiones aceptadas correctamente');
        setSelectedData([]);
      } catch (error) {
        console.error('Error al actualizar el estado de las peticiones:', error);
        toast.error('Error al aceptar las peticiones');
      }
    } else {
      toast.error('No se aceptaron las peticiones');
    }
  };

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
        <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Buscar" />
        {selectedData.length > 0 && (
          <>
            <Button className="card2 ml-5" size="small" variant="contained" onClick={() => updateStatePreasignacion(selectedData)}>
              Aceptar
            </Button>
            <Button className="card4 ms-3" size="small" variant="contained" onClick={() => handleOpen(selectedData)} disabled>
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
