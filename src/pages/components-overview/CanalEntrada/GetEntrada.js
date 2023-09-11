import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
function GetEntrada() {
  const [entrada, setEntrada] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    apiGetEntrada();
  }, []);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const apiGetEntrada = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/canal');
      setEntrada(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <select
          className="form-select mb-4 rounded-pill "
          aria-label="Default select example"
          {...register('idsiu', {
            required: {
              value: true
            }
          })}
        >
          <option value="id_entrada_canal">Seleccione un canal</option>
          {entrada &&
            entrada.map((i) => (
              <option key={i._id} value={i._id}>
                {i.nombre_canal}
              </option>
            ))}
        </select>
      </form>
    </div>
  );
}

export default GetEntrada;
