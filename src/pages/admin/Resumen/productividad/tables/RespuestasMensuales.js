import { useState, useMemo } from 'react';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { useQuery } from '@tanstack/react-query';
import { useFetchProductivity } from 'lib/admin/fetchproductividad';

export const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

export const RespuestasMensuales = () => {
  const { answersProductivity } = useFetchProductivity();
  const [fechaInicio, setFechaInicio] = useState(new Date('2025-01-01T00:00:00'));
  const [fechaFin, setFechaFin] = useState(new Date('2026-06-01T00:00:00'));

  const { data, isLoading } = useQuery({
    queryKey: ['capacidad-juridica-respuestas', fechaInicio, fechaFin],
    queryFn: () => answersProductivity(fechaInicio, fechaFin),
    refetchOnWindowFocus: false
  });

  const { columns, tableData } = useMemo(() => {
    // 1. Extraer los arreglos de la respuesta de la API de forma segura
    const rawData = data?.promedio_respuestas?.data || [];
    const promediosData = data?.total_promedio_respuestas?.data?.[0] || {};
    const promediosTipificacion = promediosData.promedio_tipificacion || [];
    const promediosGlobales = promediosData.promedio_global || [];

    if (rawData.length === 0 && promediosTipificacion.length === 0) {
      return { columns: [], tableData: [] };
    }

    // 2. Extraer meses únicos y armar columnas dinámicas
    const uniqueMonths = [...new Set(rawData.map((item) => item.mes))].sort((a, b) => a - b);
    const dynamicColumns = uniqueMonths.map((mesNum) => ({
      field: `mes_${mesNum}`,
      header: meses[mesNum - 1]
    }));

    const rowsMap = {};

    // 3. Poblar los datos mensuales (Totales, PQRS, Tutelas por mes)
    rawData.forEach((item) => {
      const { anio, mes, PQRS = 0, TUTELAS = 0, total_mes = 0 } = item;

      const pqrsKey = `${anio}_PQRS`;
      const tutelasKey = `${anio}_TUTELAS`;
      const totalKey = `${anio}_TOTAL`;

      if (!rowsMap[pqrsKey]) rowsMap[pqrsKey] = { anio, concepto: 'PQRS', esTotal: false };
      if (!rowsMap[tutelasKey]) rowsMap[tutelasKey] = { anio, concepto: 'TUTELAS', esTotal: false };
      if (!rowsMap[totalKey]) rowsMap[totalKey] = { anio, concepto: 'Total Mensual', esTotal: true };

      rowsMap[pqrsKey][`mes_${mes}`] = PQRS;
      rowsMap[tutelasKey][`mes_${mes}`] = TUTELAS;
      rowsMap[totalKey][`mes_${mes}`] = total_mes;
    });

    // 4. Integrar los Totales y Promedios por Tipificación
    promediosTipificacion.forEach((item) => {
      const key = `${item._id.anio}_${item._id.tipificacion}`; // Ej: "2026_PQRS"
      if (!rowsMap[key]) {
        // Por si la API devuelve un promedio de un año sin meses asociados en el filtro
        rowsMap[key] = { anio: item._id.anio, concepto: item._id.tipificacion, esTotal: false };
      }
      rowsMap[key].total_anual = item.total_radicados;
      rowsMap[key].promedio = item.promedio_mensual_anual;
    });

    // 5. Integrar los Totales y Promedios Globales
    promediosGlobales.forEach((item) => {
      const key = `${item._id}_TOTAL`; // Ej: "2026_TOTAL"
      if (!rowsMap[key]) {
        rowsMap[key] = { anio: item._id, concepto: 'Total Mensual', esTotal: true };
      }
      rowsMap[key].total_anual = item.total_radicados_global;
      rowsMap[key].promedio = item.promedio_mensual_anual_global;
    });

    // 6. Ordenar las filas: Año más reciente -> PQRS -> Tutelas -> Total
    const sortedRows = Object.values(rowsMap).sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio;
      if (a.esTotal) return 1;
      if (b.esTotal) return -1;
      return a.concepto.localeCompare(b.concepto);
    });

    return {
      columns: dynamicColumns,
      tableData: sortedRows
    };
  }, [data]);

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex-auto">
          <label htmlFor="fecha_inicio" className="font-bold block mb-2">
            Fecha inicio
          </label>
          <Calendar id="fecha_inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.value)} showIcon dateFormat="yy/mm/dd" />
        </div>
        <div className="flex-auto">
          <label htmlFor="fecha_fin" className="font-bold block mb-2">
            Fecha fin
          </label>
          <Calendar id="fecha_fin" className="" value={fechaFin} onChange={(e) => setFechaFin(e.value)} showIcon dateFormat="yy/mm/dd" />
        </div>
      </div>
    );
  };

  const rowClassName = (data) => {
    return data.esTotal ? { 'bg-gray-300 font-bold text-primary': true } : '';
  };

  // Helper para redondear el promedio a 1 decimal (ej: 150.41666... -> 150.4) y evitar errores de renderizado
  const formatPromedio = (val) => (val ? Number(val).toFixed(0) : '-');

  return (
    <DataTable
      value={tableData}
      header={renderHeader()}
      loading={isLoading}
      rowClassName={rowClassName}
      emptyMessage="No se encontraron registros de productividad para estas fechas."
      responsiveLayout="scroll"
      stripedRows
    >
      <Column field="anio" header="Año" className="font-bold" style={{ minWidth: '80px' }} frozen />
      <Column field="concepto" header="Tipificación" className="font-medium" style={{ minWidth: '150px' }} frozen />

      {columns.map((col) => (
        <Column key={col.field} field={col.field} header={col.header} body={(rowData) => rowData[col.field] ?? 0} />
      ))}

      {/* Columnas nuevas integradas al final */}
      <Column
        field="total_anual"
        header="Total respuestas"
        body={(rowData) => rowData.total_anual ?? '-'}
        className="font-bold border-l-black border-l-1"
      />
      <Column field="promedio" header="Promedio Mensual" body={(rowData) => formatPromedio(rowData.promedio)} className="font-bold" />
    </DataTable>
  );
};
