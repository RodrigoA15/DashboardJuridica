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
        <DataTable value={data} stripedRows removableSort selectionMode="single" emptyMessage="No se encontraron resultados">
          <Column field="username" header="Nombre" sortable />
          <Column field="estados.estado" header="Estado" />
          <Column field="estados.cantidad" header="Total" />
        </DataTable>
      </div>
    </>
  );
};
