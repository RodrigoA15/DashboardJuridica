import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TablePQRS = ({ response, loading }) => {
  const newData = response
    .filter((tutela) => tutela.tipo_asunto === 'PQRS')
    .map((item2) => item2.asuntos)
    .flat();

  return (
    <>
      <div className="card mb-3">
        <DataTable
          value={newData}
          removableSort
          dataKey="nombre_asunto"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 30]}
          emptyMessage="No se encontraron resultados"
          loading={loading}
        >
          <Column className="bluegray-100" />
          <Column field="nombre_asunto" sortable header="PQRS" />
          <Column field="total" sortable header="Total" />
        </DataTable>
      </div>
    </>
  );
};

export default TablePQRS;

TablePQRS.propTypes = {
  response: PropTypes.array,
  loading: PropTypes.bool
};
