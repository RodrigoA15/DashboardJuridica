import { useEffect, useMemo, useState } from 'react';
import axios from 'api/axios';

export const Parameters = () => {
  const [dataParameters, setDataParameters] = useState([]);

  useEffect(() => {
    getParametersApi();
  }, []);

  const getParametersApi = useMemo(
    () => async () => {
      try {
        const response = await axios.get('/parameters');
        setDataParameters(response.data);
      } catch (error) {
        console.error('Error fetching parameters:', error);
      }
    },
    []
  );

  const parameters = dataParameters.map((item) => item);

  return { parameters };
};
