import { useEffect, useState } from 'react';
import axios from 'api/axios';

const Affairs = ({ typeAffair, setValueAffair }) => {
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
      <select className="form-select rounded-pill mb-3" onChange={(e) => setValueAffair(e.target.value)}>
        <option>Seleccione asunto</option>
        {data.map((affair) => (
          <option key={affair._id} value={affair._id}>
            {affair.nombre_asunto}
          </option>
        ))}
      </select>
    </>
  );
};

export default Affairs;
