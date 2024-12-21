import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Custom hook para manejar la lógica de fetching
const useFetchAssignedUsers = () => {
  const [state, setState] = useState({ data: [], loader: false, error: null });

  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, loader: true }));
      try {
        const response = await axios.get('/assigned/allState-user');
        setState({ data: response.data, loader: false, error: null });
      } catch (error) {
        setState({
          data: [],
          loader: false,
          error: error?.response?.status === 404 ? 'No se encontraron resultados' : error.message
        });
      }
    };

    fetchData();
  }, []);

  return state;
};

// Componente principal
export const GetAssignedUser = () => {
  const { data, loader, error } = useFetchAssignedUsers();

  const renderLoader = () => (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="spinner-border text-primary" role="status" aria-label="Cargando..."></div>
      <span>Cargando...</span>
    </div>
  );

  const renderEmptyMessage = () => <div>{error || 'No hay datos para mostrar.'}</div>;

  const renderTipificacion = (rowData) =>
    rowData.tipificacion.map((tip, idx) => (
      <div key={tip.id || idx} className={tip.tipificacion === 'TUTELAS' ? 'underlineText' : ''}>
        {tip.tipificacion}
      </div>
    ));

  const renderTotalEstados = (rowData) => rowData.estados.reduce((acc, estado) => acc + estado.cantidad, 0);

  if (loader) return renderLoader();

  return (
    <div className="card">
      <DataTable
        value={data}
        rowGroupMode="rowspan"
        groupRowsBy="username"
        sortMode="single"
        sortField="username"
        sortOrder={1}
        showGridlines
        emptyMessage={renderEmptyMessage()}
      >
        <Column className="border" field="username" header="Responsable" />
        <Column className="border" header="Tipificación" body={renderTipificacion} />
        <Column
          className="border"
          header="Total"
          body={(rowData) => rowData.tipificacion.map((tip, idx) => <div key={tip.id || idx}>{tip.cantidad}</div>)}
        />
        <Column
          className="border"
          header="Estado radicado"
          body={(rowData) => rowData.estados.map((estado, idx) => <div key={estado.id || idx}>{estado.estado}</div>)}
        />
        <Column
          className="border"
          header="Total"
          align="center"
          body={(rowData) => rowData.estados.map((estado, idx) => <div key={estado.id || idx}>{estado.cantidad}</div>)}
        />
        <Column className="border" header="Total estados" align="center" body={renderTotalEstados} />
      </DataTable>
    </div>
  );
};
