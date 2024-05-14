import axios from 'api/axios';
import { useEffect, useState } from 'react';
import { useAuth } from 'context/authContext';
import useDiasHabiles from 'hooks/useDate';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

function GetAsignados() {
  const [asignados, setAsignados] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { diasHabiles } = useDiasHabiles();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'id_usuario.username': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    'id_radicado.numero_radicado': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  });

  useEffect(() => {
    {
      user && apiAsignados();

      const intervalId = setInterval(apiAsignados, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const apiAsignados = async () => {
    try {
      const response = await axios.get(`/assigned/${user.departamento._id}`);
      setAsignados(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No Haz asignado PQRS');
      } else {
        setError('Error de servidor');
      }
    }
  };

  const getBackgroundColor = (rowData) => {
    const diasLaborables = diasHabiles(rowData.id_radicado.fecha_radicado);

    const hola = classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'bg-success bg-gradient text-dark': diasLaborables <= 5,
      'bg-warning text-dark': diasLaborables >= 6 && diasLaborables <= 9,
      'dias text-dark': diasLaborables >= 10 && diasLaborables <= 12,
      'bg-danger bg-gradient text-dark': diasLaborables >= 13
    });

    return <div className={hola}>{diasLaborables}</div>;
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
      <InputText className="inputUser" type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Buscar" />
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={asignados}
        stripedRows
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        emptyMessage={error}
        header={header}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
      >
        <Column field="id_radicado.numero_radicado" header="Número radicado" sortable />
        <Column field="id_radicado.fecha_radicado" header="Fecha radicado" sortable />
        <Column field="id_radicado.id_asunto.nombre_asunto" header="Asunto" />
        <Column field="id_radicado.estado_radicado" header="Estado" />
        <Column field="fecha_asignacion" header="Fecha asignación" sortable />
        <Column field="id_usuario.username" header="Usuario encargado" sortable />
        <Column field="id_radicado.fecha_radicado" header="Dias" sortable body={getBackgroundColor} />
      </DataTable>
    </div>
  );
}

export default GetAsignados;
