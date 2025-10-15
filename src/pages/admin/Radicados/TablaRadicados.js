import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import EstadoDepartamento from './estadoDepartamentos';

function AdminRadicados() {
  const [dataRadicados, setDataRadicados] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Se añade estado de carga
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const dateEndMonth = new Date();
  const [startDate, setStartDate] = useState(dateFirstMonth);
  const [endDate, setEndDate] = useState(dateEndMonth);

  useEffect(() => {
    const apiDataRadicados = async () => {
      setIsLoading(true); // Iniciar carga
      try {
        const response = await axios.get(`/radicados/radicadosAdmin/${startDate}/${endDate}`);
        setDataRadicados(response.data);
      } catch (error) {
        setDataRadicados([]); // Limpiar datos en caso de error
        if (error.response && error.response.status === 404) {
          toast.info('No se encontraron radicados en este rango de fechas.');
        } else {
          toast.error('Error de servidor al cargar los datos.');
        }
      } finally {
        setIsLoading(false); // Finalizar carga
      }
    };
    apiDataRadicados();
  }, [startDate, endDate]);

  const handleFechaInicio = (e) => setStartDate(e.value);
  const handleFechaFin = (e) => setEndDate(e.value);

  const formatFecha = (rowData) => {
    const fecha = rowData.fecha_radicado;
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  const renderHeader = () => {
    return (
      // Reemplaza 'row' y 'col-6' por un grid responsivo de Tailwind
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
        <div>
          <label htmlFor="dat-start" className="block text-sm font-semibold text-gray-600 mb-2">
            Fecha de Inicio
          </label>
          <Calendar value={startDate} onChange={handleFechaInicio} className="w-full" dateFormat="dd/mm/yy" />
        </div>
        <div>
          <label htmlFor="date-end" className="block text-sm font-semibold text-gray-600 mb-2">
            Fecha de Fin
          </label>
          <Calendar value={endDate} onChange={handleFechaFin} className="w-full" dateFormat="dd/mm/yy" />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    // Reemplaza 'row' con un layout flex responsivo (columna en móvil, fila en desktop)
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-gray-50 min-h-screen">
      {/* Columna principal para la tabla (ocupa 2/3 en pantallas grandes) */}
      <div className="w-full lg:w-2/3">
        {/* Reemplaza 'card' con clases de Tailwind para un estilo consistente */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <DataTable
            value={dataRadicados}
            dataKey="_id"
            size="small"
            header={header}
            paginator
            rows={10} // Aumentado para mejor visualización
            showGridlines
            stripedRows
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} a {last} de {totalRecords}"
            emptyMessage="No se encontraron resultados"
            loading={isLoading} // Propiedad de carga de PrimeReact
          >
            <Column field="numero_radicado" header="Número radicado" sortable />
            <Column field="fecha_radicado" header="Fecha radicado" body={formatFecha} sortable />
            <Column field="id_asunto.nombre_asunto" header="Asunto" />
            <Column field="id_departamento.nombre_departamento" header="Área" />
            <Column field="estado_radicado" header="Estado radicado" sortable />
          </DataTable>
        </div>
      </div>

      <div className="w-full lg:w-1/3">
        <EstadoDepartamento />
      </div>
    </div>
  );
}

export default AdminRadicados;
