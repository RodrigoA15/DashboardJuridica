import { useEffect, useState } from 'react';
import axios from 'axios';

function GetEntidad({ setEntidad }) {
  const [dataEntidad, setDataEntidad] = useState([]);

  useEffect(() => {
    listEntidad();
  }, []);

  const listEntidad = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/entidad');
      setDataEntidad(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <select className="form-select rounded-pill" onChange={(e) => setEntidad(e.target.value)}>
        <option>Seleccione la entidad</option>
        {dataEntidad.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre_entidad}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GetEntidad;