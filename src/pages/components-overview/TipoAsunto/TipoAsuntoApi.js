import axios from 'api/axios';
import { useEffect, useState } from 'react';
import TablePQRS from './TablePQRS';
import TableTutelas from './TableTutelas';
const TipoAsuntoApi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    tipoAsuntoApi();
  }, []);

  const tipoAsuntoApi = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/typeAffair/PQRS');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="d-flex flex-column mb-3">
          {error === null ? (
            <>
              <TablePQRS response={data} />
              <TableTutelas response={data} />
            </>
          ) : (
            <span className="errors">{error}</span>
          )}
        </div>
      )}
    </>
  );
};

export default TipoAsuntoApi;
