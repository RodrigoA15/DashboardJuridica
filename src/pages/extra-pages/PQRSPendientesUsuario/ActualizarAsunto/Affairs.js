import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

import axios from 'api/axios';

const Affairs = ({ valueAffair, typeAffair, setValueAffair, granted }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (typeAffair) {
      allTypesAffairs();
    }
  }, [typeAffair]);

  const allTypesAffairs = async () => {
    try {
      const response = await axios.get(`/typeAffair/types/${typeAffair}`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="affairs">
          Asunto
        </label>
        <Dropdown
          value={valueAffair}
          options={data}
          onChange={(e) => setValueAffair(e.value)}
          disabled={granted === 'Devuelto'}
          optionLabel="nombre_asunto"
          placeholder="Seleccione asunto"
        />
      </div>
    </>
  );
};

export default Affairs;
