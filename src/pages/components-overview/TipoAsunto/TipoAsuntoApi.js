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
      <div className="d-flex flex-column">
        {error === null ? (
          <>
            <TablePQRS response={data} loading={loading} />
            <TableTutelas response={data} loading={loading} />
          </>
        ) : (
          <span className="errors">{error}</span>
        )}
      </div>
    </>
  );
};

export default TipoAsuntoApi;
