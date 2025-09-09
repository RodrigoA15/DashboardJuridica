import { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import axios from 'api/axios';

const hoy = new Date();
let dia2 = hoy.getDate();
dia2 = dia2.toString().padStart(2, '0');
const manana = new Date(hoy);
manana.setDate(hoy.getDate() + 1);

const año = manana.getFullYear();
const mes = String(manana.getMonth() + 1).padStart(2, '0');
const dia = String(manana.getDate()).padStart(2, '0');

const dateFormat = `${año}-${mes}-${dia}`;
const dateFormat2 = `${año}-${mes}-${dia2}`;

const fetchUserAnswers = async (startDate, endDate) => {
  const response = await axios.get(`/answer/answer-users/${startDate}/${endDate}`);
  return response.data;
};

export const TableUsersAnswer = () => {
  const [data, setData] = useState([]);
  const [loadig, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(dateFormat2);
  const [endDate, setEndDate] = useState(dateFormat);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchUserAnswers(startDate, endDate);
      setData(response);
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loadig) return <p>Loading...</p>;

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between items-center">
        <input
          className="form-control border border-primary-subtle"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className="form-control border border-primary-subtle"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="btn btn-success mx-3" onClick={() => fetchData(startDate, endDate)}>
          Filtrar
        </button>
      </div>
    );
  };

  const header = renderHeader();
  return (
    <DataTable
      value={data}
      emptyMessage={error}
      header={header}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      removableSort
      stripedRows
      tableStyle={{ width: '25rem' }}
      size="small"
    >
      <Column className="border border-2 border-primary-subtle" field="_id" header="Usuario" align="center" sortable />
      <Column className="border border-2 border-primary-subtle" field="count" align="center" header="Total respuestas" sortable />
    </DataTable>
  );
};
