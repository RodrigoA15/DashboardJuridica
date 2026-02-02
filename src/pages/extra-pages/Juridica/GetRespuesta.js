import { useState } from 'react';
import { Column } from 'primereact/column';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { useAuth } from 'context/authContext';
import PDFViewerAnswers from './PDFViewerAnswers';
import { useFetchAnswers } from 'lib/PQRS/fetchAnswers';
import { useFetchPendientes } from 'lib/PQRS/fetchPendientes.js';
import { useFormatDate } from 'hooks/useFormatDate';

export const GetRespuesta = () => {
  const { user } = useAuth();
  const { formatDate } = useFormatDate();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'id_asignacion.id_usuario.username': { value: null, matchMode: FilterMatchMode.IN }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const { fetchUsersByArea } = useFetchPendientes();
  const { fetchAnswers } = useFetchAnswers();
  const { data, isLoading, error } = useQuery({
    queryKey: ['answers-area', user.departamento._id],
    queryFn: () => fetchAnswers(user.departamento._id),
    retry: false
  });

  const { data: users } = useQuery({
    queryKey: ['users-area', user.departamento._id],
    queryFn: () => fetchUsersByArea(user.departamento._id),
    enabled: !!user
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const representativeFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={users}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="username"
        optionValue="username"
        placeholder="Seleccionar usuarios"
        className="p-column-filter"
        maxSelectedLabels={1}
      />
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
      </div>
    );
  };

  const header = renderHeader();

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={isLoading}
      dataKey="_id"
      filters={filters}
      globalFilterFields={[
        'id_asignacion.id_radicado.numero_radicado',
        'id_asignacion.id_radicado.id_asunto.nombre_asunto',
        'id_asignacion.id_usuario.username',
        'numero_radicado_respuesta'
      ]}
      header={header}
      emptyMessage={'No se encontrarón respuestas' || error}
      onFilter={(e) => setFilters(e.filters)}
    >
      <Column field="id_asignacion.id_radicado.numero_radicado" header="Número radicado" sortable />
      <Column
        field="id_asignacion.id_radicado.fecha_radicado"
        header="Fecha radicado"
        sortable
        body={(rowData) => formatDate(rowData.id_asignacion.id_radicado.fecha_radicado)}
      />
      <Column field="id_asignacion.id_radicado.id_asunto.nombre_asunto" header="Asunto" sortable />
      <Column
        header="Usuario asignado"
        field="id_asignacion.id_usuario.username"
        filter
        showFilterMatchModes={false}
        filterElement={representativeFilterTemplate}
        style={{ minWidth: '14rem' }}
      />
      <Column
        field="id_asignacion.fecha_asignacion"
        header="Fecha asignación"
        sortable
        body={(rowData) => formatDate(rowData.id_asignacion.fecha_asignacion)}
      />
      <Column field="numero_radicado_respuesta" header="Número radicado respuesta" sortable />
      <Column field="fechaRespuesta" header="Fecha respuesta" sortable body={(rowData) => formatDate(rowData.fechaRespuesta)} />
      <Column field="pdfRespuesta" header="PDF" body={(rowData) => <PDFViewerAnswers data={rowData} />} />
    </DataTable>
  );
};
