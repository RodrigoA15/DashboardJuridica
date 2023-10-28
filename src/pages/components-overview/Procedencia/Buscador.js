import { useState } from 'react';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, OutlinedInput } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

function Buscador({ setProcedencia }) {
  const [numero_identificacion, setNumero_identificacion] = useState('');
  const [procedenciaData, setProcedenciaData] = useState([]);
  const [entrada, setEntrada] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar la recarga de la página
      GetidentificacionById();
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setNumero_identificacion(e.target.value);
  };

  const resetEntrada = () => {
    setEntrada(false);
  };
  const GetidentificacionById = async () => {
    if (numero_identificacion.trim() === '') {
      toast.error('El termino busqueda no puede estar vacio');
    }
    try {
      const response = await axios.get(`/procedencia/procedencia/${numero_identificacion}`);
      if (response.data.length > 0) {
        setProcedenciaData(response.data);
        const procedenciaValue = response.data[0]._id;
        setProcedencia(procedenciaValue);
        setEntrada(true);
      } else {
        console.log('No se encontro el usuario  :(', 'error');
        resetEntrada();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Usuario no  registrado');
        resetEntrada();
      } else {
        console.log(error);
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    PostProcedencia(data);
    console.log(data);
  });

  //Data metodo post

  const PostProcedencia = async (data) => {
    try {
      await axios.post('/procedencia/procedencia', { ...data, numero_identificacion });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="row ">
        {/* Select */}
        <h4>Informaci&oacute;n Procedencia</h4>

        {/* Buscador */}
        <div className="col-4 input-container">
          <OutlinedInput
            size="small"
            id="search2"
            sx={{
              width: '400px',
              border: '1px solid black',
              borderRadius: '5px'
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            }
            placeholder="Busca por numero de identificacion"
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Campos de entrada*/}
        {entrada === true && (
          <div>
            {procedenciaData.map((i) => (
              <div key={i._id} className="row">
                <div className="col mb-3">
                  <label htmlFor="nombre" className="form-label h6">
                    Nombre
                  </label>
                  <input type="text" className="form-control rounded-pill minimal-input-dark" id="nombre" value={i.nombre} readOnly />
                </div>
                <div className="col mb-3">
                  <label htmlFor="label" className="form-label h6">
                    Apellido
                  </label>
                  <input type="text" className="form-control rounded-pill minimal-input-dark" id="apellido" value={i.apellido} readOnly />
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          {entrada === false && (
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-4">
                  <select
                    className="form-select mt-4 rounded-pill"
                    {...register('tipo_identificacion', { required: 'Tipo identificación es requerido' })}
                  >
                    <option value="">Seleccione tipo de Identificaci&oacute;n</option>
                    <option value="CC">Cedula de ciudadania</option>
                    <option value="CE">Cedula de extranjeria</option>
                    <option value="PEP">Permiso Especial De Permanencia</option>
                    <option value="PPT">Permiso Proteccion Temporal</option>
                  </select>
                  {errors.tipo_identificacion && <span className="inputForm ">{errors.tipo_identificacion.message}</span>}
                </div>
                <div className="col  mb-3">
                  <label htmlFor="nombre" className="form-label  h6">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill minimal-input-dark"
                    id="nombres"
                    {...register('nombre', { required: { value: true, message: 'Campo nombre es requerido' } })}
                  />
                  {errors.nombre && <span className="inputForm ">{errors.nombre.message}</span>}
                </div>

                <div className="col mb-3">
                  <label htmlFor="label" className="form-label h6">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill minimal-input-dark"
                    id="apellidos"
                    {...register('apellido', { required: { value: true, message: 'Campo apellido es requerido' } })}
                  />
                  {errors.apellido && <span className="inputForm ">{errors.apellido.message}</span>}
                </div>

                <div className="row">
                  <div className="col">
                    <select
                      className="form-select  rounded-pill minimal-input-dark"
                      {...register('tipo_contacto', {
                        required: 'Tipo contacto es obligatorio'
                      })}
                    >
                      <option value="">Seleccione una opci&oacute;n de contacto</option>
                      <option value="direccion">Dirección</option>
                      <option value="telefono">Teléfono</option>
                      <option value="correo">Correo Electrónico</option>
                    </select>

                    {errors.tipo_contacto && <span className="inputForm ">{errors.tipo_contacto.message}</span>}
                  </div>
                  <div className="col">
                    <input
                      className="form-control rounded-pill minimal-input-dark"
                      placeholder="Informaci&oacute;n de contacto"
                      type="text"
                      id="contacto"
                      {...register('info_contacto', { required: 'Información de contacto es requerido' })}
                    />
                    {errors.info_contacto && <span className="inputForm ">{errors.info_contacto.message}</span>}
                  </div>
                </div>
              </div>

              <div className="col-2 mb-3">
                <button className="btn btn-primary mt-3" type="submit">
                  Registrar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Exc radicados */}
    </div>
  );
}

export default Buscador;

Buscador.proTypes = {
  setProcedencia: PropTypes.func.isRequired
};
