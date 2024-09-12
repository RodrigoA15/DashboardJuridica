import { useEffect, useState } from 'react';
import axios from 'api/axios';
export const ApiAreas = () => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    getAreasApi();
  }, []);
  const getAreasApi = async () => {
    try {
      const response = await axios('/area');
      setAreas(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    areas
  };
};
