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
      let mesesValidos = 0;

      dynamicColumns.forEach((col) => {
        if (row[col.field] && typeof row[col.field].promedio_diario === 'number') {
          // Verificamos si el promedio del mes es mayor a 0
          if (row[col.field].promedio_diario > 0) {
            sumaPromediosDiarios += row[col.field].promedio_diario;
            mesesValidos++; // Incrementamos el divisor solo si se cumple la condición
          }
        }
      });

      // Si hay meses válidos, dividimos entre esa cantidad.
      // Si todos son 0, dividimos por 1 para evitar errores (0 / 1 = 0).
      const divisor = mesesValidos > 0 ? mesesValidos : 1;
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

  const isCellSelectable = (event) => event.data.field === 'promedio_diario_total' && true;

  const renderHeader = () => {
    // 1. Lógica dinámica para mostrar los datos correctos según la tipificación activa
    const esPQRS = tipificacionActiva === 'PQRS';

    // Ajusta estas claves según cómo las devuelva tu backend para Tutelas
    const personasReqMeta = esPQRS
      ? data_projections?.cantidad_personas_req_meta_pqr
      : data_projections?.cantidad_personas_req_meta_tutela || data_projections?.cantidad_personas_req_meta_tutelas;

    const personasReqRespuestas = esPQRS
      ? data_projections?.cantidad_personas_req_pqr
      : data_projections?.cantidad_personas_req_tutela || data_projections?.cantidad_personas_req_tutelas;

    return (
      <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6">
        {/* SECCIÓN 1: Banner de Instrucciones */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-sm text-blue-800">
          <p className="font-medium">
            Para realizar la proyección, selecciona las celdas de la columna{' '}
            <span className="font-extrabold text-blue-950">Prom. Diario General</span>
          </p>
        </div>

        {/* SECCIÓN 2: Panel de Control (Grid de 4 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* Columna A: Rango de Fechas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Rango de Proyección</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="fecha_inicio" className="font-semibold text-gray-700 block mb-1 text-xs">
                  Fecha inicio
                </label>
                <Calendar
                  id="fecha_inicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.value)}
                  showIcon
                  dateFormat="yy/mm/dd"
                  maxDate={fechaFin}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="fecha_fin" className="font-semibold text-gray-700 block mb-1 text-xs">
                  Fecha fin
                </label>
                <Calendar
                  id="fecha_fin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.value)}
                  showIcon
                  dateFormat="yy/mm/dd"
                  minDate={fechaInicio}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Columna B: Configuración de Metas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metas Diarias</h3>
            <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="flex items-center justify-between text-xs font-semibold text-gray-600">
                Meta PQRS:
                <input
                  type="number"
                  className="w-20 p-1.5 border bg-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-right font-bold text-gray-800"
                  value={metas.PQRS}
                  onChange={(e) => setMetas((prev) => ({ ...prev, PQRS: Number(e.target.value) }))}
                />
              </label>
              <label className="flex items-center justify-between text-xs font-semibold text-gray-600">
                Meta Tutelas:
                <input
                  type="number"
                  className="w-20 p-1.5 border bg-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-right font-bold text-gray-800"
                  value={metas.TUTELAS}
                  onChange={(e) => setMetas((prev) => ({ ...prev, TUTELAS: Number(e.target.value) }))}
                />
              </label>
            </div>
          </div>

          {/* Columna C: Visualización de Métricas / Resultados */}
          <div className="space-y-3 md:border-l md:border-gray-100 md:pl-6">
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Resultados</h3>
              <select
                value={tipificacionActiva}
                onChange={(e) => setTipificacionActiva(e.target.value)}
                className="p-1 text-xs border-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 bg-gray-50 cursor-pointer border-blue-600"
              >
                <option value="PQRS">Por PQRS</option>
                <option value="TUTELAS">Por Tutelas</option>
              </select>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-100">
                <span>Promedio diario de respuesta:</span>
                <span className="font-bold text-gray-900 text-sm">{promedio ? `${promedio.toFixed(2)}` : '0.00'}</span>
              </div>

              <div className="space-y-2 pt-1">
                <span className="block font-bold text-gray-400 uppercase tracking-tight text-[10px]">Personal Requerido</span>

                <div className="flex justify-between items-center">
                  <span>Según Meta de {tipificacionActiva}:</span>
                  <span className="font-extrabold text-blue-600 text-sm">{personasReqMeta || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Según Capacidad de Respuesta:</span>
                  <span className="font-extrabold text-blue-600 text-sm">{personasReqRespuestas || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna D: Resumen de Selección y Acción */}
          <div className="flex flex-col justify-between h-full min-h-[140px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <div>
              <span className="text-3xl font-black text-slate-800">{selectedCells.length}</span>
              <span className="block text-xs text-slate-500 mt-1">celdas seleccionadas</span>
            </div>

            <button
              onClick={() => refetch()}
              disabled={isLoadingProjections || selectedCells.length === 0}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all duration-200 text-sm"
            >
              {isLoadingProjections ? 'Calculando...' : 'Generar Proyección'}
            </button>
          </div>
        </div>

        {/* Alerta de Error integrada */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs flex items-center gap-2 self-start">
            <span className="font-bold">Error:</span> {error?.response?.data?.message || 'Hubo un problema al procesar los datos.'}
          </div>
        )}
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
      emptyMessage={
        <div className="text-center py-8 text-gray-400">
          <i className="pi pi-calendar-times text-3xl mb-2 block"></i>
          <span>No se encontraron registros de usuarios para estas fechas.</span>
        </div>
      }
      responsiveLayout="scroll"
      stripedRows
      sortField="promedio_diario_total"
      sortOrder={-1}
      paginator
      rows={6}
      rowsPerPageOptions={[6, 12, 18, 24]}
      // Claves para la selección interactiva de celdas
      cellSelection
      selectionMode="multiple"
      selection={selectedCells}
      isDataSelectable={isCellSelectable}
      onFilter={(e) => setFilters(e.filters)}
      onSelectionChange={(e) => setSelectedCells(e.value)}
      // Clase personalizada para estilizar las celdas seleccionadas globalmente
      className="p-datatable-sm border border-gray-100 rounded-lg overflow-hidden shadow-sm"
    >
      {/* Columnas Congeladas de Identificación */}
      <Column field="username" header="Usuario" className="font-bold" style={{ minWidth: '150px' }} frozen />
      <Column field="anio" header="Año" className="font-semibold" frozen />
      <Column
        field="concepto"
        header="Tipificación"
        className="font-medium border-r border-gray-200"
        frozen
        filter
        showFilterMatchModes={false}
        filterElement={representativeFilterTemplate}
      />

      {/* Columnas Dinámicas de Meses */}
      {columns.map((col) => (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={(rowData) => mesBodyTemplate(rowData, col.field)}
          style={{ minWidth: '110px' }}
          className="text-gray-600 border-r border-gray-50 text-center"
        />
      ))}

      {/* COLUMNA ESTRELLA: Promedio Diario General (Interactiva) */}
      <Column
        field="promedio_diario_total"
        header={
          <div className="flex flex-col items-center gap-1 w-full">
            <span>Prom. Diario General</span>
          </div>
        }
        body={(rowData) => promedioDiarioTemplate(rowData)}
        style={{ minWidth: '160px', textAlign: 'center' }}
        alignFrozen="right"
        sortable
      />

      {/* Columnas de Resumen */}
      <Column
        field="total_general"
        header="Total Periodo"
        body={(rowData) => <span className="font-semibold text-gray-800">{rowData.total_general ?? '-'}</span>}
        style={{ minWidth: '130px', textAlign: 'center' }}
        alignFrozen="right"
      />
      <Column
        field="promedio"
        header="Promedio Mensual"
        body={(rowData) => <span className="font-semibold text-gray-800">{formatPromedio(rowData.promedio)}</span>}
        style={{ minWidth: '140px', textAlign: 'center' }}
        alignFrozen="right"
      />
    </DataTable>
  );
};
