import { memo, useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import GetDepartamentos from '../Departamento/GetDepartamentos';

const GetEntidad = memo(({ register, errors, setIdDepartamento, id_departamento }) => {
  const [dataEntidad, setDataEntidad] = useState([]);
  const [idEntidadSeleccionada, setIdEntidadSeleccionada] = useState('');

  useEffect(() => {
    listEntidad();
  }, []);

  const listEntidad = async () => {
    try {
      const response = await axios.get('/entity');
      const data = response.data;
      setDataEntidad(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <select
          className="form-select rounded-pill minimal-input-dark"
          {...register('id_entidad', {
            required: 'Campo entidad es obligatorio'
          })}
          onChange={(e) => {
            setIdEntidadSeleccionada(e.target.value);
            setIdDepartamento(e.target.value);
          }}
        >
          <option value="">Seleccione entidad</option>
          {dataEntidad.map((entidad) => (
            <option key={entidad._id} value={entidad._id}>
              {entidad.nombre_entidad}
            </option>
          ))}
        </select>
        {errors.id_entidad && <span className="inputForm">{errors.id_entidad.message}</span>}
      </div>

      <GetDepartamentos
        register={register}
        setIdDepartamento={setIdDepartamento}
        id_departamento={id_departamento}
        errors={errors}
        dataEntidad={dataEntidad}
        selectedEntityId={idEntidadSeleccionada}
      />
    </div>
  );
});

GetEntidad.propTypes = {
  register: PropTypes.func.isRequired
};

export default GetEntidad;
