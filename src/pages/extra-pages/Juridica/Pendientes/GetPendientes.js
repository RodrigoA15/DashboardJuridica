import { useState } from 'react';
import { Column } from 'primereact/column';
import { useAuth } from 'context/authContext';
import { useQuery } from '@tanstack/react-query';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Reject } from './Reject';
import { useBadge } from 'hooks/Badge';
import { CreateAssignment } from './CreateAssignment';
import { useFetchPendientes } from 'lib/PQRS/fetchPendientes';
import { SelectUserByArea } from 'components/select/selectUserByArea';

export default function GetPendientes() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState('');
  const { renderDiasLaborables } = useBadge();
  const { fetchRadicadosByStatus } = useFetchPendientes();
  const { data, isLoading } = useQuery({
    queryKey: ['radicados-pendientes', user.departamento._id],
    queryFn: () => fetchRadicadosByStatus(user.departamento._id),
    retry: false
  });
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex w-full sm:w-1/2 items-center gap-4">
            <InputText
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              value={globalFilterValue || ''}
              onChange={(e) => onGlobalFilterChange(e)}
              placeholder="Buscar..."
            />
            <div className="flex items-center gap-3 text-sm text-gray-600 whitespace-nowrap">
              <p>
                Pendientes: <span className="font-bold text-gray-800">{data?.length}</span>
              </p>
              <p>
                Seleccionados: <span className="font-bold text-blue-600">{selected.length}</span>
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <SelectUserByArea selectedUser={usuario} setSelectedUser={setUsuario} />
          </div>
          <CreateAssignment selectedData={selected} setSelected={setSelected} usuario={usuario} setUsuario={setUsuario} />
          <Reject selectedData={selected} setSelected={setSelected} />
        </div>
      </>
    );
  };

  const header = renderHeader();
  return (
    <>
      <div>
        <DataTable
          value={data}
          removableSort
          selection={selected}
          onSelectionChange={(e) => setSelected(e.value)}
          dataKey="_id"
          header={header}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30]}
          emptyMessage={'No se encontraron resultados'}
          selectionPageOnly
          loading={isLoading}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} className="bluegray-100" />
          <Column field="numero_radicado" sortable header="Número radicado" />
          <Column field="fecha_radicado" sortable header="Fecha radicado" />
          <Column field="asunto" header="Asunto" />
          <Column field="observaciones_radicado" header="Observaciones" />
          <Column field="procedencia" header="Procedencia" />
          <Column field="fecha_radicado" sortable header="Dias" body={renderDiasLaborables} />
        </DataTable>
      </div>
    </>
  );
}
