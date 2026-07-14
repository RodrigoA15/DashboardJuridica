import { useState, useMemo } from 'react';
import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import { meses } from 'data/meses';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { useQuery } from '@tanstack/react-query';
import { FilterMatchMode } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { useFetchProductivity } from 'lib/admin/fetchproductividad';

const DIAS_LABORALES = 20;

export const AsignacionUsuarios = () => {
  const { userProductivity, projections } = useFetchProductivity();
  const [selectedCells, setSelectedCells] = useState([]);
  const [promedioCell, setPromedioCell] = useState(0);
  const [fechaInicio, setFechaInicio] = useState(() => new Date(new Date().getFullYear(), 0, 1));
  const [fechaFin, setFechaFin] = useState(() => new Date());
  const [metas, setMetas] = useState({
    PQRS: 12,
    TUTELAS: 4
  });
  const [tipificacionActiva, setTipificacionActiva] = useState('PQRS');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    concepto: { value: null, matchMode: FilterMatchMode.IN }
  });
  const [tipificaciones] = useState([
    {
      concepto: 'PQRS'
    },
    {
      concepto: 'TUTELAS'
    }
  ]);

  const { data, isLoading } = useQuery({
    queryKey: ['productividad-usuarios', fechaInicio, fechaFin],
    queryFn: () => userProductivity(fechaInicio, fechaFin),
    refetchOnWindowFocus: false
  });

  const {
    data: data_projections,
    isLoading: isLoadingProjections,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['proyecciones-usuarios', fechaInicio, fechaFin, promedioCell, tipificacionActiva, metas[tipificacionActiva], DIAS_LABORALES],
    queryFn: () => projections(fechaInicio, fechaFin, promedioCell, tipificacionActiva, metas[tipificacionActiva], DIAS_LABORALES),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const { columns, tableData } = useMemo(() => {
    const dataMensual = data?.promedio_usuarios.data || [];
    const dataPromedios = data?.promedio_total_usuarios?.data || [];

    if (dataMensual.length === 0) return { columns: [], tableData: [] };

    const uniqueMonths = [...new Set(dataMensual.map((item) => item.mes))].sort((a, b) => a - b);
    const dynamicColumns = uniqueMonths.map((mesNum) => ({
      field: `mes_${mesNum}`,
      header: meses[mesNum - 1]
    }));

    const rowsMap = {};

    dataMensual.forEach((item) => {
      const { username, anio, mes, pqrs = 0, tutelas = 0, promedio_diario_pqrs = 0, promedio_diario_tutelas = 0 } = item;

      const pqrsKey = `${username}_${anio}_PQRS`;
      const tutelasKey = `${username}_${anio}_TUTELAS`;

      // Solo creamos las filas de PQRS y TUTELAS (se elimina la creación de _TOTAL)
      if (!rowsMap[pqrsKey]) rowsMap[pqrsKey] = { username, anio, concepto: 'PQRS', esTotal: false };
      if (!rowsMap[tutelasKey]) rowsMap[tutelasKey] = { username, anio, concepto: 'TUTELAS', esTotal: false };

      rowsMap[pqrsKey][`mes_${mes}`] = {
        valor: pqrs,
        promedio_diario: promedio_diario_pqrs
      };

      rowsMap[tutelasKey][`mes_${mes}`] = {
        valor: tutelas,
        promedio_diario: promedio_diario_tutelas
      };
    });

    dataPromedios.forEach((userItem) => {
      Object.keys(rowsMap).forEach((key) => {
        if (key.startsWith(`${userItem.username}_`)) {
          if (key.includes('_PQRS')) {
            rowsMap[key].total_general = userItem.pqrs;
            rowsMap[key].promedio = userItem.promedio_pqrs;
          } else if (key.includes('_TUTELAS')) {
            rowsMap[key].total_general = userItem.tutelas;
            rowsMap[key].promedio = userItem.promedio_tutelas;
          }
          // Se elimina el condicional que llenaba el '_TOTAL'
        }
      });
    });

    Object.values(rowsMap).forEach((row) => {
      let sumaPromediosDiarios = 0;

      dynamicColumns.forEach((col) => {
        if (row[col.field] && typeof row[col.field].promedio_diario === 'number') {
          sumaPromediosDiarios += row[col.field].promedio_diario;
        }
      });

      const divisor = dynamicColumns.length > 0 ? dynamicColumns.length : 1;
      row.promedio_diario_total = sumaPromediosDiarios / divisor;
    });

    const usuariosConCeros = new Set();

    Object.values(rowsMap).forEach((row) => {
      dynamicColumns.forEach((col) => {
        if (!row[col.field] || row[col.field].valor <= 0) {
          usuariosConCeros.add(row.username);
        }
      });
    });

    const validRows = Object.values(rowsMap).filter((row) => row.total_general > 0);

    const sortedRows = validRows.sort((a, b) => {
      if (a.username !== b.username) return a.username.localeCompare(b.username);
      if (a.anio !== b.anio) return b.anio - a.anio;
      return a.concepto.localeCompare(b.concepto);
    });

    return {
      columns: dynamicColumns,
      tableData: sortedRows
    };
  }, [data]);

  const promedio = useMemo(() => {
    if (!selectedCells || selectedCells.length === 0) return 0;
    const sumaTotal = selectedCells.reduce((acumulador, cell) => acumulador + cell.value, 0);
    setPromedioCell(sumaTotal / selectedCells.length);

    return sumaTotal / selectedCells.length;
  }, [selectedCells]);

  const renderHeader = () => {
    return (
      <div className="card flex flex-wrap gap-6 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex-auto">
          <label htmlFor="fecha_inicio" className="font-bold text-gray-700 block mb-2 text-sm">
            Fecha inicio
          </label>
          <Calendar
            id="fecha_inicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.value)}
            showIcon
            dateFormat="yy/mm/dd"
            maxDate={fechaFin}
          />
        </div>

        <div className="flex-auto">
          <label htmlFor="fecha_fin" className="font-bold text-gray-700 block mb-2 text-sm">
            Fecha fin
          </label>
          <Calendar
            id="fecha_fin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.value)}
            showIcon
            dateFormat="yy/mm/dd"
            minDate={fechaInicio}
          />
        </div>

        {/* Inputs dinámicos */}
        <div className="flex flex-col font-medium text-sm text-gray-600 gap-2">
          <label className="flex items-center justify-between gap-3">
            Meta PQRS:
            <input
              type="number"
              className="w-16 p-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={metas.PQRS}
              onChange={(e) => setMetas((prev) => ({ ...prev, PQRS: Number(e.target.value) }))}
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            Meta Tutelas:
            <input
              type="number"
              className="w-16 p-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={metas.TUTELAS}
              onChange={(e) => setMetas((prev) => ({ ...prev, TUTELAS: Number(e.target.value) }))}
            />
          </label>
        </div>

        {/* Select y Resultados */}
        <div className="flex flex-col font-medium text-sm text-gray-600 gap-2 border-l border-gray-200 pl-4">
          <select
            value={tipificacionActiva}
            onChange={(e) => setTipificacionActiva(e.target.value)}
            className="p-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
          >
            <option value="PQRS">PQRS</option>
            <option value="TUTELAS">Tutelas</option>
          </select>

          <span>Total Promedio respuesta: {promedio?.toFixed(2)}</span>
          <span>Cantidad personas requeridas de acuerdo a:</span>
          <span>Metas: {data_projections?.cantidad_personas_req_meta_pqr}</span>
          <span>Respuestas: {data_projections?.cantidad_personas_req_pqr}</span>
        </div>
        <div>
          <span className="text-sm">Items seleccionados: {selectedCells.length}</span>
          <div className="flex flex-col justify-end mt-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => refetch()}
              disabled={isLoadingProjections || selectedCells.length <= 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition-colors"
            >
              {isLoadingProjections ? 'Calculando...' : 'Generar Proyección'}
            </button>
          </div>
        </div>
        <span className="text-sm text-red-500">{isError && error.response.data.message}</span>
      </div>
    );
  };
  const rowClassName = (data) => {
    return data.esTotal ? { 'bg-gray-300 font-bold text-primary': true } : '';
  };

  const formatPromedio = (val) => (val !== undefined && val !== null ? Number(val).toFixed(0) : '-');

  const mesBodyTemplate = (rowData, colField) => {
    const celda = rowData[colField];

    if (!celda) return <div className="text-center">0</div>;

    return (
      <div className="flex flex-col items-center justify-center">
        <span className="text-base">{celda.valor}</span>
        {celda.promedio_diario > 0 && (
          <span className="text-xs text-gray-500 font-normal mt-1 whitespace-nowrap">
            Promedio d&iacute;a:({formatPromedio(celda.promedio_diario)})
          </span>
        )}
      </div>
    );
  };

  const promedioDiarioTemplate = (rowData) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <span>{formatPromedio(rowData.promedio_diario_total)}</span>
        {rowData.promedio_diario_total > 0 && (
          <span className="text-xs text-gray-500 font-normal mt-1 whitespace-nowrap">
            A meta:
            <Badge
              value={
                rowData.concepto === 'PQRS'
                  ? (rowData.promedio_diario_total - 12).toFixed(0)
                  : (rowData.promedio_diario_total - 4).toFixed(0)
              }
              severity={
                rowData.concepto === 'PQRS'
                  ? rowData.promedio_diario_total - 12 < 0
                    ? 'danger'
                    : 'success'
                  : rowData.promedio_diario_total - 4 < 0
                  ? 'danger'
                  : 'success'
              }
            />
          </span>
        )}
      </div>
    );
  };

  const representativeFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={tipificaciones}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="concepto"
        optionValue="concepto"
        placeholder="Seleccionar tipificacion"
        className="p-column-filter"
        maxSelectedLabels={1}
      />
    );
  };

  return (
    <DataTable
      value={tableData}
      header={renderHeader()}
      loading={isLoading}
      rowClassName={rowClassName}
      filters={filters}
      emptyMessage="No se encontraron registros de usuarios para estas fechas."
      responsiveLayout="scroll"
      stripedRows
      sortField="promedio_diario_total"
      sortOrder={-1}
      paginator
      rows={6}
      rowsPerPageOptions={[6, 12, 18, 24]}
      cellSelection
      selectionMode="multiple"
      selection={selectedCells}
      onFilter={(e) => setFilters(e.filters)}
      onSelectionChange={(e) => setSelectedCells(e.value)}
    >
      <Column field="username" header="Usuario" className="font-bold" style={{ minWidth: '150px' }} frozen />
      <Column field="anio" header="Año" className="font-bold" frozen />
      <Column
        field="concepto"
        header="Tipificación"
        className="font-medium"
        frozen
        filter
        showFilterMatchModes={false}
        filterElement={representativeFilterTemplate}
      />

      {columns.map((col) => (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={(rowData) => mesBodyTemplate(rowData, col.field)}
          style={{ minWidth: '110px' }}
        />
      ))}

      <Column
        field="promedio_diario_total"
        header="Prom. Diario General"
        body={(rowData) => promedioDiarioTemplate(rowData)}
        style={{ minWidth: '160px', textAlign: 'center' }}
        alignFrozen="right"
        sortable
      />

      <Column
        field="total_general"
        header="Total Periodo"
        body={(rowData) => rowData.total_general ?? '-'}
        style={{ minWidth: '130px', textAlign: 'center' }}
        alignFrozen="right"
      />
      <Column
        field="promedio"
        header="Promedio Mensual"
        body={(rowData) => formatPromedio(rowData.promedio)}
        style={{ minWidth: '140px', textAlign: 'center' }}
        alignFrozen="right"
      />
    </DataTable>
  );
};
