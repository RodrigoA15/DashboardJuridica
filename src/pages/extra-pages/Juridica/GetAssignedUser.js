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
    rowData.data.map((tip, idx) => (
      <div key={tip.id || idx} className={tip.tipificacion === 'TUTELAS' ? 'underlineText' : ''}>
        {tip.tipificacion}
      </div>
    ));

  const renderTotalEstados = (rowData) => rowData.data.reduce((acc, estado) => acc + estado.total, 0);

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
        <Column className="border" field="nombre_usuario" header="Responsable" />
        <Column className="border" header="Tipificaci&oacute;n" body={renderTipificacion} />
        <Column
          className="border"
          header="Estado radicado"
          body={(item) =>
            item.data.map((item2, index) => (
              <div key={index}>
                <span>{item2.estado_radicado}</span>
              </div>
            ))
          }
        />
        <Column
          className="border"
          header="Total estados"
          align="center"
          body={(item) => item.data.map((item2, index) => <div key={index}>{item2.total}</div>)}
        />
        <Column className="border" header="Total estados" align="center" body={renderTotalEstados} />
      </DataTable>
    </div>
  );
};
