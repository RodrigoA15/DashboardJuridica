import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TableTutelas = ({ response }) => {
  const newData = response
    .filter((tutela) => tutela.tipo_asunto === 'Tutelas')
    .map((item2) => item2.asuntos)
    .flat();

  return (
    <>
      <div className="card">
        <DataTable
          value={newData}
          removableSort
          dataKey="nombre_asunto"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 30]}
          emptyMessage="No se encontraron resultados"
        >
          <Column className="bluegray-100" />
          <Column field="nombre_asunto" sortable header="Tutelas" />
          <Column field="total" sortable header="Total" />
        </DataTable>
      </div>
    </>
  );
};

export default TableTutelas;

TableTutelas.propTypes = {
  response: PropTypes.array
};
