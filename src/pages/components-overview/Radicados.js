// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
// import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'api/axios';
import GetEntrada from './CanalEntrada/GetEntrada';
import Buscador from './Procedencia/Buscador';
import GetAsunto from './Asunto/GetAsunto';
import GetTipificacion from './Tipificacion/GetTipificacion';
import GetEntidad from './Entidad/GetEntidad';
import GetDepartamentos from './Departamento/GetDepartamentos';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function ComponentRadicados() {
  const [numero_radicado, setNumero_radicado] = useState('');
  const [fecha_radicado, setFecha_radicado] = useState('');
  //Canal Entrada
  const [canalEntrada, setCanalEntrada] = useState('');
  //Asunto
  const [asunto, setAsunto] = useState('');
  //Tipificacion
  const [tipificacion, setTipificacion] = useState('');
  //Entidad
  const [entidad, setEntidad] = useState('');
  //Procedencia
  const [procedencia, setProcedencia] = useState('');
  //Departamentos
  const [departamento, setDepartamento] = useState('');
  const {
    register,
    watch,
    formState: { errors }
  } = useForm();
  const MySwal = withReactContent(Swal);
  const datos = {
    numero_radicado: numero_radicado,
    fecha_radicado: fecha_radicado,
    id_canal_entrada: canalEntrada,
    id_asunto: asunto,
    id_tipificacion: tipificacion,
    id_entidad: entidad,
    id_procedencia: procedencia,
    id_departamento: departamento,
    estado_radicado: 'Pendiente'
  };

  const createRadicado = async () => {
    try {
      await axios.post(`/radicados/radicados`, datos);
      MySwal.fire({
        title: 'Creado correctamente',
        icon: 'success'
      });
    } catch (error) {
      console.log(error);
      MySwal.fire({
        title: 'Error al crear radicado',
        icon: 'error'
      });
    }
  };

  return (
    <ComponentSkeleton>
      <MainCard title="Crear Radicados" className="border-card card-background">
        <form>
          <Buscador createRadicado={createRadicado} setProcedencia={setProcedencia} />

          <div className="row">
            <div className="col">
              <select className="form-select mb-4 rounded-pill minimal-input-dark" {...register('info_contacto')}>
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
                    className="form-control rounded-pill minimal-input-dark"
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
                    className="form-control rounded-pill minimal-input-dark"
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
                    className="form-control rounded-pill minimal-input-dark"
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

          {/* Radicados */}
          <div className="row mb-3">
            <h4>Informacion Radicado</h4>
            <div className="mb-3 col">
              <label htmlFor="label" className="form-label h6">
                Numero radicado
              </label>
              <input
                type="number"
                className="form-control rounded-pill minimal-input-dark"
                id="radicados"
                onChange={(e) => setNumero_radicado(e.target.value)}
              />
            </div>

            <div className="mb-3 col">
              <label htmlFor="fecha" className="form-label h6">
                Fecha Radicado
              </label>
              <input
                type="date"
                className="form-control rounded-pill minimal-input-dark"
                id="fecha"
                onChange={(e) => setFecha_radicado(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h3>Canal Entrada</h3>

              <GetEntrada setCanalEntrada={setCanalEntrada} />
            </div>

            <div className="mb-3 col">
              <h3>Asunto</h3>

              <GetAsunto setAsunto={setAsunto} />
            </div>

            <div className="mb-3 col">
              <h3>Tipificacion</h3>

              <GetTipificacion setTipificacion={setTipificacion} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h3>Entidad</h3>

              <GetEntidad setEntidad={setEntidad} />
            </div>

            <div className="mb-3 col">
              <h3>Dirigido a </h3>

              <GetDepartamentos setDepartamento={setDepartamento} />
            </div>
          </div>
        </form>
      </MainCard>
    </ComponentSkeleton>
  );
}

export default ComponentRadicados;
