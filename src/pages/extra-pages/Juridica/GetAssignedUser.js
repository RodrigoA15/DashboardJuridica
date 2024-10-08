import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const GetAssignedUser = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    assignedUser();
  }, []);

  const assignedUser = async () => {
    try {
      const response = await axios.get('/assigned/allState-user');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={data}
          rowGroupMode="rowspan"
          groupRowsBy="username"
          sortMode="single"
          sortField="username"
          sortOrder={1}
          showGridlines
          emptyMessage="No se encontraron resultados"
        >
          <Column className="border" field="username" header="Nombre"></Column>
          <Column
            className="border"
            header="Estado"
            body={(rowData) => rowData.estados.map((estado, index) => <div key={index}>{estado.estado}</div>)}
          ></Column>
          <Column
            className="border"
            header="Total"
            body={(rowData) => rowData.estados.map((estado, index) => <div key={index}>{estado.cantidad}</div>)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};
