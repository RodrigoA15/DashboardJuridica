import { useAuth } from 'context/authContext';
import useDiasHabiles from 'hooks/useDate';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import axios from 'api/axios';
import UsuariosJuridica from 'pages/extra-pages/Juridica/UsuariosJuridica';

export default function GetPendientes() {
  const [selected, setSelected] = useState([]);
  const [dataApi, setDataApi] = useState([]);
  const { user } = useAuth();
  const { diasHabiles } = useDiasHabiles();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    'id_procedencia.nombre': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    numero_radicado: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  });

  useEffect(() => {
    allPending();
  }, []);

  const allPending = async () => {
    try {
      const response = await axios.get(`/radicados/depjuridica_radicados/${user.departamento._id}`);
      setDataApi(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBackgroundColor = (rowData) => {
    const diasLaborables = diasHabiles(rowData.fecha_radicado);
    const hola = classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'bg-success bg-gradient text-dark': diasLaborables <= 5,
      'bg-warning text-dark-900': diasLaborables >= 6 && diasLaborables <= 9,
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
      <>
        <div className="row">
          <div className="d-flex justify-content-between items-center col-6">
            <InputText
              className="inputUser"
              type="search"
              value={value || ''}
              onChange={(e) => onGlobalFilterChange(e)}
              placeholder="Buscar"
            />
            <p className="m-1">Total pendientes: {dataApi.length}</p>
            <p className="m-1">Seleccionados: {selected.length}</p>
          </div>
          <div className="col-6">
            <UsuariosJuridica dataRadicados={selected} data={dataApi} setDataApi={setDataApi} setSelected={setSelected} />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();
  return (
    <>
      <div className="card">
        <DataTable
          value={dataApi}
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
          emptyMessage="No se encontraron resultados"
          selectionPageOnly
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} className="bluegray-100" />
          <Column field="numero_radicado" sortable header="Número radicado" />
          <Column field="fecha_radicado" sortable header="Fecha radicado" />
          <Column field="id_asunto.nombre_asunto" header="Asunto" />
          <Column field="observaciones_radicado" header="Observaciones" />
          <Column field="id_procedencia.nombre" header="Procedencia" />
          <Column field="fecha_radicado" sortable header="Dias" body={getBackgroundColor} />
        </DataTable>
      </div>
    </>
  );
}
