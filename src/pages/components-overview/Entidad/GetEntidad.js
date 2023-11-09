import { useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import GetDepartamentos from '../Departamento/GetDepartamentos';

function GetEntidad({ register, errors, setIdDepartamento, id_departamento }) {
  const [dataEntidad, setDataEntidad] = useState([]);
  const [idEntidadSeleccionada, setIdEntidadSeleccionada] = useState('');

  useEffect(() => {
    listEntidad();
  }, []);

  const listEntidad = async () => {
    try {
      const response = await axios.get('/entidad/entidad');
      const data = response.data;
      setDataEntidad(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row">
      <div className="col-6">
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
          <option value="">Seleccione la entidad</option>
          {dataEntidad.map((entidad) => (
            <option key={entidad._id} value={entidad._id}>
              {entidad.nombre_entidad}
            </option>
          ))}
        </select>
        {errors.id_entidad && <span className="inputForm">{errors.id_entidad.message}</span>}
      </div>

      <div className="row">
        <div className="mb-3 col">
          <h4>Dirigido a</h4>
          <GetDepartamentos
            register={register}
            setIdDepartamento={setIdDepartamento}
            id_departamento={id_departamento}
            errors={errors}
            dataEntidad={dataEntidad}
            selectedEntityId={idEntidadSeleccionada}
          />
        </div>

        <div className="mb-3 col">
          <h4>N&uacute;mero de respuestas</h4>
          <input
            className="form-control rounded-pill minimal-input-dark"
            type="number"
            {...register('cantidad_respuesta', {
              required: 'Cantidad de respuesta es obligatorio',
              min: {
                value: 1,
                message: 'Cantidad respuesta debe ser minimo 1 respuesta'
              },

              max: {
                value: 20,
                message: 'Cantidad respuesta debe ser maximo 20 respuestas'
              }
            })}
          />
          {errors.cantidad_respuesta && <span className="inputForm">{errors.cantidad_respuesta.message}</span>}
        </div>
      </div>
    </div>
  );
}

GetEntidad.propTypes = {
  register: PropTypes.func.isRequired
};

export default GetEntidad;
