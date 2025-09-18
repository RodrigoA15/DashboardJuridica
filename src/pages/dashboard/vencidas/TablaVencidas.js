import { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useDiasHabiles from 'hooks/useDate';
import axios from 'api/axios';
import { useFormatDate } from 'hooks/useFormatDate';

const TablaVencidas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { diasHabiles } = useDiasHabiles();
  const { formatDate } = useFormatDate();

  useEffect(() => {
    getPQRSexpired();
  }, []);

  const getPQRSexpired = async () => {
    try {
      const response = await axios.get('/radicados/vencidas');
      setData(response.data);
    } catch (error) {
      setError('Hubo un problema al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const getDiasLaborablesClass = (diasLaborables) => {
    return classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'dias text-dark': diasLaborables >= 10 && diasLaborables <= 12,
      'bg-danger bg-gradient text-dark': diasLaborables >= 13
    });
  };

  const getBackgroundColor = (rowData) => {
    const diasLaborables = diasHabiles(rowData.fecha_radicado);
    return <div className={getDiasLaborablesClass(diasLaborables)}>{diasLaborables}</div>;
  };

  return (
    <>
      <DataTable
        value={data}
        stripedRows
        removableSort
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage={error || 'No se encontraron radicados'}
        loading={loading}
      >
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="fecha_radicado" header="Fecha radicado" sortable body={(rowData) => formatDate(rowData.fecha_radicado)} />
        <Column field="id_departamento" header="Área" />
        <Column field="id_usuario" header="Responsable" />
        <Column field="fecha_asignacion" header="Fecha asignacion" body={(rowData) => formatDate(rowData.fecha_asignacion)} />
        <Column field="fecha_radicado" header="Dias" sortable body={getBackgroundColor} />
      </DataTable>
    </>
  );
};

export default TablaVencidas;
