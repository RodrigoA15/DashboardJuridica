import { memo, useEffect, useState } from 'react';
import axios from 'api/axios';
import Affairs from './Affairs';

const TypeAffair = memo(({ setValueAffair, granted }) => {
  const [data, setData] = useState([]);
  const [valueAffair, setValueTypeAffair] = useState(null);
  useEffect(() => {
    allTypesAffairs();
  }, []);

  const allTypesAffairs = async () => {
    try {
      const response = await axios.get('/typeAffair');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <select
        className="form-select rounded-pill mb-3"
        onChange={(e) => setValueTypeAffair(e.target.value)}
        disabled={granted === 'Devuelto'}
      >
        <option value={null}>Seleccione tipo asunto</option>
        {data.map((affair) => (
          <option key={affair._id} value={affair._id}>
            {affair.nombre_tipo_asunto}
          </option>
        ))}
      </select>
      <Affairs typeAffair={valueAffair} setValueAffair={setValueAffair} granted={granted} />
    </>
  );
});

export default TypeAffair;
