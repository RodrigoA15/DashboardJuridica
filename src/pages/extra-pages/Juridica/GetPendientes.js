import { useAuth } from 'context/authContext';
import useDiasHabiles from 'hooks/useDate';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useCallback, useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import axios from 'api/axios';
import UsuariosJuridica from 'pages/extra-pages/Juridica/UsuariosJuridica';

export default function GetPendientes() {
  const [selected, setSelected] = useState([]);
  const [dataApi, setDataApi] = useState([]);
  const { user } = useAuth();
  const { diasHabiles } = useDiasHabiles();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
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

  const getDiasLaborablesClass = useCallback((dias) => {
    return classNames('rounded-full flex justify-center items-center text-center font-bold w-8 h-8', {
      'bg-green-700 text-black': dias <= 5,
      'bg-yellow-500 text-black': dias >= 6 && dias <= 9,
      'bg-orange-500 text-black': dias >= 10 && dias <= 12,
      'bg-red-500 bg-gradient text-black': dias >= 13
    });
  }, []);

  const renderDiasLaborables = useCallback(
    (rowData) => {
      const dias = diasHabiles(rowData.fecha_radicado);
      return <div className={getDiasLaborablesClass(dias)}>{dias}</div>;
    },
    [diasHabiles, getDiasLaborablesClass]
  );

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
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex w-full sm:w-1/2 items-center gap-4">
            <InputText
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              value={value || ''}
              onChange={(e) => onGlobalFilterChange(e)}
              placeholder="Buscar..."
            />
            <div className="flex items-center gap-3 text-sm text-gray-600 whitespace-nowrap">
              <p>
                Pendientes: <span className="font-bold text-gray-800">{dataApi.length}</span>
              </p>
              <p>
                Seleccionados: <span className="font-bold text-blue-600">{selected.length}</span>
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <UsuariosJuridica dataRadicados={selected} data={dataApi} setDataApi={setDataApi} setSelected={setSelected} />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader();
  return (
    <>
      <div>
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
          <Column field="fecha_radicado" sortable header="Dias" body={renderDiasLaborables} />
        </DataTable>
      </div>
    </>
  );
}
