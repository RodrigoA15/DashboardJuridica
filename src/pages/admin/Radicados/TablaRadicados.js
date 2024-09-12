import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { toast } from 'sonner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import EstadoDepartamento from './estadoDepartamentos';

function AdminRadicados() {
  const [dataRadicados, setDataRadicados] = useState([]);
  const fecha = new Date();
  const dateFirstMonth = new Date(fecha.getFullYear(), fecha.getMonth(), 0);
  const dateEndMonth = new Date();
  const [startDate, setStartDate] = useState(dateFirstMonth);
  const [endDate, setEndDate] = useState(dateEndMonth);

  useEffect(() => {
    apiDataRadicados();
  }, [startDate, endDate]);

  const apiDataRadicados = async () => {
    try {
      const response = await axios.get(`/radicados/radicadosAdmin/${startDate}/${endDate}`);
      setDataRadicados(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron radicados');
      } else {
        toast.error('Error de servidor');
      }
    }
  };

  const handleFechaInicio = (e) => {
    setStartDate(e.target.value);
  };

  const handleFechaFin = (e) => {
    setEndDate(e.target.value);
  };

  const renderHeader = () => {
    return (
      <div className="row">
        <div className="col-6">
          <Calendar value={startDate} onChange={handleFechaInicio} />
        </div>
        <div className="col-6">
          <Calendar value={endDate} onChange={handleFechaFin} />
        </div>
      </div>
    );
  };

  const formatFecha = (rowData) => {
    const fecha = rowData.fecha_radicado;
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };
  const header = renderHeader();

  return (
    <div className="row">
      <div className="card col-8">
        <DataTable
          value={dataRadicados}
          dataKey="_id"
          size="small"
          header={header}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} a {last} de {totalRecords}"
          emptyMessage="No se encontraron resultados"
        >
          <Column field="numero_radicado" header="Número radicado" />
          <Column field="fecha_radicado" header="Fecha radicado" body={formatFecha} />
          <Column field="cantidad_respuesta" header="Cantidad respuesta" />
          <Column field="id_canal_entrada.nombre_canal" header="Canal entrada" />
          <Column field="id_asunto.nombre_asunto" header="Asunto" />
          <Column field="id_tipificacion.nombre_tipificacion" header="Tipificacion" />
          <Column field="id_entidad.nombre_entidad" header="Entidad" />
          <Column field="id_departamento.nombre_departamento" header="Área" />
          <Column field="estado_radicado" header="Estado radicado" />
        </DataTable>
      </div>
      <div className="col-4">
        <EstadoDepartamento />
      </div>
    </div>
  );
}

export default AdminRadicados;
