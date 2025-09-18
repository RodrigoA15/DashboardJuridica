import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'api/axios';

export const useParameters = () => {
  const [dataParameters, setDataParameters] = useState([]);
  const [loading, setLoading] = useState(true);

  const getParametersApi = useCallback(async () => {
    try {
      const response = await axios.get('/parameters');
      setDataParameters(response.data);
    } catch (error) {
      console.error('Error fetching parameters:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getParametersApi();
  }, [getParametersApi]);

  const parameters = useMemo(() => dataParameters, [dataParameters]);

  return { parameters, loading };
};
