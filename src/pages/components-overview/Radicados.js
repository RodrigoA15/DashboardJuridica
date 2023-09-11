// material-ui

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import GetEntrada from './CanalEntrada/GetEntrada';

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function ComponentRadicados() {
  const [numero_radicado, setNumero_radicado] = useState('');
  const [fecha_radicado, setFecha_radicado] = useState('');

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm({ mode: 'onBlur' });

  const datos = {
    numero_radicado: numero_radicado,
    fecha_radicado: fecha_radicado
  };

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    createRadicado();
    reset();
  });

  const createRadicado = async () => {
    try {
      await axios.post(`http://localhost:4000/api/radicados`, datos);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ComponentSkeleton>
      <MainCard title="Crear Radicados">
        <form onSubmit={onSubmit}>
          <div className="row ">
            <h4>Informacion Procedencia</h4>
            <div className="col">
              <select className="form-select mt-4 mb-4 rounded-pill" {...register('tipo_identificacion')}>
                <option>Seleccione tipo de Identificacion</option>
                <option value="CC">Cedula de ciudadania</option>
                <option value="CE">Cedula de extranjeria</option>
                <option value="PS">Pasaporte</option>
                <option value="P">Permanencia</option>
              </select>

              {watch('tipo_identificacion') == 'CC' && (
                <>
                  <input
                    type="number"
                    placeholder="Cedula de Ciudadania"
                    className="form-control mb-3 "
                    {...register('cedula_ciudadania', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio'
                      },
                      minLength: {
                        value: 8,
                        message: 'Debe tener minimo 8 caracteres'
                      },
                      maxLength: {
                        value: 10,
                        message: 'Debe tener maximo 10 caracteres'
                      }
                    })}
                  />
                  {errors.cedula_ciudadania && <span className="errors">{errors.cedula_ciudadania.message}</span>}
                </>
              )}

              {watch('tipo_identificacion') == 'CE' && (
                <>
                  <input
                    type="number"
                    placeholder="Cedula de Extranjeria"
                    className="form-control mb-3"
                    {...register('cedula_extranjeria', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio'
                      },
                      minLength: {
                        value: 8,
                        message: 'Debe tener minimo 8 caracteres'
                      },
                      maxLength: {
                        value: 10,
                        message: 'Debe tener maximo 10 caracteres'
                      }
                    })}
                  />
                  {errors.cedula_extranjeria && <span className="errors">{errors.cedula_extranjeria.message}</span>}
                </>
              )}
            </div>

            <div className="col">
              <label htmlFor="nombre" className="form-label h6">
                Nombre
              </label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="nombre"
                {...register('nombre', {
                  required: {
                    value: true,
                    message: 'Esta campo es obligatorio'
                  }
                })}
              />
              {errors.nombre && <span className="errors">{errors.nombre.message}</span>}
            </div>

            <div className=" col-3">
              <label htmlFor="label" className="form-label h6">
                Apellido
              </label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="apellido"
                {...register('apellido', {
                  required: {
                    value: true,
                    message: 'Esta campo es obligatorio'
                  }
                })}
              />
              {errors.apellido && <span className="errors">{errors.apellido.message}</span>}
            </div>
          </div>

          <div className="row">
            <div className="col">
              <select className="form-select mb-4 rounded-pill" {...register('info_contacto')}>
                <option>Seleccione una opcion de contacto</option>
                <option value="direccion">Direccion</option>
                <option value="telefono">Telefono</option>
                <option value="correo">Correo Electronico</option>
              </select>
            </div>
            <div className="col">
              {watch('info_contacto') == 'direccion' && (
                <>
                  <input
                    className="form-control rounded-pill"
                    placeholder="Direccion de residencia"
                    type="text"
                    id="direccion"
                    {...register('direccion', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio'
                      }
                    })}
                  />
                  {errors.direccion && <span className="errors">{errors.direccion.message}</span>}
                </>
              )}

              {watch('info_contacto') == 'telefono' && (
                <>
                  <input
                    className="form-control rounded-pill"
                    placeholder="Telefono"
                    type="text"
                    id="telefono"
                    {...register('telefono', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio'
                      }
                    })}
                  />
                  {errors.telefono && <span className="errors">{errors.telefono.message}</span>}
                </>
              )}

              {watch('info_contacto') == 'correo' && (
                <>
                  <input
                    className="form-control rounded-pill"
                    placeholder="Correo Electronico"
                    type="text"
                    id="correo"
                    {...register('correo', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio'
                      }
                    })}
                  />
                  {errors.correo && <span className="errors">{errors.correo.message}</span>}
                </>
              )}
            </div>
          </div>

          <div className="row ">
            <div className="col"></div>
          </div>
          <div className="row mb-3">
            <h4>Informacion Radicado</h4>
            <div className="mb-3 col">
              <label htmlFor="label" className="form-label h6">
                Numero radicado
              </label>
              <input
                type="number"
                className="form-control rounded-pill"
                id="radicados"
                onChange={(e) => setNumero_radicado(e.target.value)}
                {...register('numero_radicado', {
                  required: {
                    value: true,
                    message: 'Esta campo es obligatorio'
                  }
                })}
              />
              {errors.numero_radicado && <span className="errors">{errors.numero_radicado.message}</span>}
            </div>

            <div className="mb-3 col">
              <label htmlFor="fecha" className="form-label h6">
                Fecha Radicado
              </label>
              <input
                type="date"
                className="form-control rounded-pill"
                id="fecha"
                onChange={(e) => setFecha_radicado(e.target.value)}
                {...register('fecha_radicado', {
                  required: {
                    value: true,
                    message: 'Esta campo es obligatorio'
                  }
                })}
              />
              {errors.fecha_radicado && <span className="errors">{errors.fecha_radicado.message}</span>}
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h3>Canal Entrada</h3>

              <div>
                <GetEntrada />
              </div>
            </div>

            <div className="mb-3 col">
              <h3>Asunto</h3>

              <select className="form-select mb-4 rounded-pill " aria-label="Default select example">
                <option value="numero_identificacion">Numero Identificacion</option>
                <option value="tipo_infraccion">Tipo Infraccion</option>
                <option value="placa">Placa</option>
                <option value="placa">Cambio Infractor</option>
              </select>
            </div>

            <div className="mb-3 col">
              <h3>Tipificacion</h3>

              <select className="form-select mb-4 rounded-pill " aria-label="Default select example">
                <option value="numero_identificacion">Numero Identificacion</option>
                <option value="tipo_infraccion">Tipo Infraccion</option>
                <option value="placa">Placa</option>
                <option value="placa">Cambio Infractor</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h3>Entidad</h3>

              <select className="form-select mb-4 rounded-pill " aria-label="Default select example">
                <option value="numero_identificacion">Numero Identificacion</option>
                <option value="tipo_infraccion">Tipo Infraccion</option>
                <option value="placa">Placa</option>
                <option value="placa">Cambio Infractor</option>
              </select>
            </div>

            <div className="mb-3 col">
              <h3>Dirigido a </h3>

              <select className="form-select mb-4 rounded-pill " aria-label="Default select example">
                <option value="numero_identificacion">Numero Identificacion</option>
                <option value="tipo_infraccion">Tipo Infraccion</option>
                <option value="placa">Placa</option>
                <option value="placa">Cambio Infractor</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            Enviar
          </button>
        </form>
      </MainCard>
    </ComponentSkeleton>
  );
}

export default ComponentRadicados;
