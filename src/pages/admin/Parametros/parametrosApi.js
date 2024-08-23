import { useEffect, useState } from 'react';
import axios from 'api/axios';
import TablaParametros from './Tabla';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const ParametrosApi = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    alert();
    getParametros();
  }, []);

  const MySwal = withReactContent(Swal);

  const alert = () => {
    MySwal.fire({
      title: 'Bienvenido al módulo de parámetros',
      text: 'Este módulo es con el fin de administrar parámetros para PQRS ATLÁNTICO',
      icon: 'info'
    });
  };

  const getParametros = async () => {
    try {
      const response = await axios.get('/parameters');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <TablaParametros data={data} />
    </div>
  );
};

export default ParametrosApi;
