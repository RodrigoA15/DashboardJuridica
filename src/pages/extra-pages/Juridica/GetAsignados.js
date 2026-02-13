import axios from 'api/axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from 'context/authContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useBadge } from 'hooks/Badge';
import { useFormatDate } from 'hooks/useFormatDate';

function GetAsignados() {
  const { renderDiasLaborables } = useBadge();
  const [asignados, setAsignados] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { formatDate } = useFormatDate();
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

  const departamentosIds = useMemo(() => user?.departamento?.map((d) => d._id).join(',') || '', [user?.departamento]);

  const apiAsignados = useCallback(async () => {
    if (!departamentosIds) return;

    try {
      const response = await axios.get(`/assigned/area/${departamentosIds}`);
      setAsignados(response.data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 404) {
        setAsignados([]);
        setError('No has asignado PQRS');
      } else {
        setError('Error de servidor');
      }
    }
  }, [departamentosIds]);

  useEffect(() => {
    apiAsignados();
  }, [apiAsignados]);

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
        <Column
          field="id_radicado.fecha_radicado"
          header="Fecha radicado"
          sortable
          body={(rowData) => formatDate(rowData.id_radicado.fecha_radicado)}
        />
        <Column field="id_radicado.id_asunto.nombre_asunto" header="Asunto" />
        <Column field="id_radicado.estado_radicado" header="Estado" />
        <Column field="fecha_asignacion" header="Fecha asignación" body={(rowData) => formatDate(rowData.fecha_asignacion)} sortable />
        <Column field="id_usuario.username" header="Usuario encargado" sortable />
        <Column field="id_radicado.fecha_radicado" header="Dias" sortable body={(rowData) => renderDiasLaborables(rowData.id_radicado)} />
      </DataTable>
    </div>
  );
}

export default GetAsignados;
