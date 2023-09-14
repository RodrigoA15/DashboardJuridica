import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetAsunto({ setAsunto }) {
  const [dataAsunto, setDataAsunto] = useState([]);

  useEffect(() => {
    listaAsuntos();
  }, []);

  const listaAsuntos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/asunto');
      setDataAsunto(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select className="form-control rounded-pill" onChange={(e) => setAsunto(e.target.value)}>
        <option>Seleccione un asunto</option>
        {dataAsunto &&
          dataAsunto.map((i) => (
            <option key={i._id} value={i._id}>
              {i.nombre_asunto}
            </option>
          ))}
      </select>
    </div>
  );
}

export default GetAsunto;
