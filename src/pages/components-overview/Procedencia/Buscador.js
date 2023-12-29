import { useState } from 'react';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, OutlinedInput } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Juzgados from './Juzgados';

function Buscador({ setProcedencia, setNameCourt, nameCourt, setJuzgados }) {
  const [numero_identificacion, setNumero_identificacion] = useState('');
  const [procedenciaData, setProcedenciaData] = useState([]);
  const [entrada, setEntrada] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      search: ''
    }
  });

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

  const validacion = async () => {
    if (numero_identificacion.trim() === '') {
      toast.error('El término búsqueda no puede estar vacío');
    }
  };

  const GetidentificacionById = async () => {
    validacion();
    try {
      const response = await axios.get(`/procedencia/procedencias/${numero_identificacion}`);
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
        toast.error('Usuario no  registrado', {
          description: 'Llene los campos y registre la procedencia',
          duration: 10000
        });
        resetEntrada();
      } else {
        console.log(error.message);
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    validacion();
    PostProcedencia(data);
    reset();
  });

  //Data metodo post

  const PostProcedencia = async (data) => {
    try {
      await axios.post('/procedencia/procedencia', { ...data, numero_identificacion });
      toast.success('Usuario registrado', {
        description: 'Por favor realice la búsqueda nuevamente',
        duration: 10000
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="row ">
        <>
          <h4>Informaci&oacute;n usuario</h4>

          {/* Buscador */}
          <div className="col-4 input-container mb-4">
            <OutlinedInput
              {...register('search', {
                required: 'El termino busqueda no puede estar vacio',
                minLength: { value: 2, message: 'Número identificacion debe ser mayor a 6 caracteres' }
              })}
              size="small"
              id="search2"
              sx={{
                width: '430px'
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: -0.5 }}>
                  <SearchOutlined />
                </InputAdornment>
              }
              placeholder="Digite número de identificación y pulse enter para buscar"
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              required
            />
            {errors.search && <span className="inputForm ">{errors.search.message}</span>}
          </div>

          {/* Campos de entrada*/}
          {entrada === true && (
            <div>
              {procedenciaData.map((i) => (
                <div key={i._id} className="row">
                  <div className="col mb-3">
                    <label htmlFor="nombre" className="form-label h6">
                      Nombres
                    </label>
                    <input type="text" className="form-control rounded-pill minimal-input-dark" id="nombre" value={i.nombre} readOnly />
                  </div>
                  <div className="col mb-3">
                    <label htmlFor="label" className="form-label h6">
                      Apellidos
                    </label>
                    <input type="text" className="form-control rounded-pill minimal-input-dark" id="apellido" value={i.apellido} readOnly />
                  </div>

                  <div>
                    {i.numero_identificacion === 12345 && (
                      <div>
                        <label htmlFor="nombre" className="form-label h6">
                          Entidad juridica
                        </label>
                        <Juzgados setNameCourt={setNameCourt} nameCourt={nameCourt} setJuzgados={setJuzgados} />
                      </div>
                    )}
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
                    <label htmlFor="label" className="form-label h6">
                      Tipo documento
                    </label>
                    <select
                      className="form-select  rounded-pill minimal-input-dark"
                      {...register('tipo_identificacion', { required: 'Tipo identificación es requerido' })}
                    >
                      <option value="">Seleccione...</option>
                      <option value="CC">Cedula de ciudadania</option>
                      <option value="CE">Cedula de extranjeria</option>
                      <option value="PEP">Permiso Especial De Permanencia</option>
                      <option value="PPT">Permiso Proteccion Temporal</option>
                    </select>
                    {errors.tipo_identificacion && <span className="inputForm ">{errors.tipo_identificacion.message}</span>}
                  </div>
                  <div className="col  mb-3">
                    <label htmlFor="nombre" className="form-label  h6">
                      Nombres
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill minimal-input-dark"
                      id="nombres"
                      {...register('nombre', { required: { value: true, message: 'Campo nombre es requerido' } })}
                    />
                    {errors.nombre && <span className="inputForm ">{errors.nombre.message}</span>}
                  </div>

                  <div className="col mb-4">
                    <label htmlFor="label" className="form-label h6">
                      Apellidos
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
                      <label htmlFor="label" className="form-label h6">
                        Seleccione una opci&oacute;n de contacto
                      </label>

                      <select
                        className="form-select  rounded-pill minimal-input-dark"
                        {...register('tipo_contacto', {
                          required: 'Tipo contacto es obligatorio'
                        })}
                      >
                        <option value="">Seleccione...</option>
                        <option value="direccion">Dirección</option>
                        <option value="telefono">Teléfono</option>
                        <option value="correo">Correo Electrónico</option>
                      </select>

                      {errors.tipo_contacto && <span className="inputForm ">{errors.tipo_contacto.message}</span>}
                    </div>

                    <div className="col mt-4">
                      {watch('tipo_contacto') == 'direccion' && (
                        <div>
                          <input
                            className="form-control rounded-pill minimal-input-dark"
                            placeholder="Direcci&oacute;n"
                            type="text"
                            id="direccion"
                            {...register('direccion', { required: 'Información de contacto es requerido' })}
                          />
                          {errors.direccion && <span className="inputForm ">{errors.direccion.message}</span>}
                        </div>
                      )}

                      {watch('tipo_contacto') == 'telefono' && (
                        <div>
                          <input
                            className="form-control rounded-pill minimal-input-dark"
                            placeholder="Tel&eacute;fono"
                            type="number"
                            id="telefono"
                            {...register('telefono', {
                              required: 'Información de contacto es requerido',
                              minLength: { value: 8, message: 'Número de teléfono  debe ser minimo 8 caracteres' },
                              maxLength: { value: 12, message: 'Número de teléfono  debe ser maximo 12 caracteres' }
                            })}
                          />
                          {errors.telefono && <span className="inputForm ">{errors.telefono.message}</span>}
                        </div>
                      )}

                      {watch('tipo_contacto') == 'correo' && (
                        <div>
                          <input
                            className="form-control rounded-pill minimal-input-dark"
                            placeholder="Correo electr&oacute;nico"
                            type="email"
                            id="correo"
                            {...register('correo', {
                              required: 'Información de contacto es requerido',
                              pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: 'Correo no valido, no cumple formato'
                              }
                            })}
                          />
                          {errors.correo && <span className="inputForm ">{errors.correo.message}</span>}
                        </div>
                      )}
                    </div>
                    <div className="col"></div>
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
        </>
      </div>
    </div>
  );
}

export default Buscador;

Buscador.propTypes = {
  setProcedencia: PropTypes.func.isRequired,
  setJuzgados: PropTypes.func.isRequired,
  setNameCourt: PropTypes.func.isRequired,
  nameCourt: PropTypes.string.isRequired
};
