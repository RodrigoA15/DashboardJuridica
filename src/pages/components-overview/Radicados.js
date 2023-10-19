// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import GetEntrada from './CanalEntrada/GetEntrada';
import Buscador from './Procedencia/Buscador';
import GetTipificacion from './Tipificacion/GetTipificacion';
import GetEntidad from './Entidad/GetEntidad';
import GetDepartamentos from './Departamento/GetDepartamentos';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from 'context/authContext';
import { Button } from '../../../node_modules/@mui/material/index';

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function ComponentRadicados() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const { user } = useAuth();
  const [procedencia, setProcedencia] = useState('');
  const [id_departamento, setIdDepartamento] = useState('');
  const [check, setCheck] = useState(false);

  const MySwal = withReactContent(Swal);

  const onSubmit = handleSubmit((data) => {
    createRadicado(data);
    console.log(data);
  });

  const createRadicado = async (data) => {
    try {
      const datos = { ...data, id_procedencia: procedencia, estado_radicado: 'Pre-asignacion', id_departamento };
      await axios.post(`/radicados/radicados`, datos);
      MySwal.fire({
        title: 'Creado correctamente',
        icon: 'success'
      });
      reset();
    } catch (error) {
      console.error('Error al crear radicado:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear radicado';
      MySwal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
    }
  };

  return (
    <ComponentSkeleton>
      <MainCard title="Crear Radicados" className="border-card card-background">
        <form onSubmit={onSubmit}>
          <Buscador setProcedencia={setProcedencia} />
          {user.username}
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
                {...register('numero_radicado', {
                  required: {
                    value: true,
                    message: 'Numero Radicado es obligatorio'
                  }
                })}
              />
              {errors.numero_radicado && <span className="inputForm ">{errors.numero_radicado.message}</span>}
            </div>

            <div className="mb-3 col">
              <label htmlFor="fecha" className="form-label h6">
                Fecha Radicado
              </label>
              <input
                type="date"
                className="form-control rounded-pill minimal-input-dark"
                id="fecha"
                {...register('fecha_radicado', {
                  required: {
                    value: true,
                    message: 'Fecha Radicado es obligatorio'
                  }
                })}
              />
              {errors.fecha_radicado && <span className="inputForm ">{errors.fecha_radicado.message}</span>}
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h4>Canal Entrada</h4>
              <GetEntrada register={register} errors={errors} />
            </div>

            <div className="mb-3 col">
              <h4>Tipificacion</h4>

              <GetTipificacion register={register} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h4>Entidad</h4>

              <GetEntidad register={register} />
            </div>

            <div className="mb-3 col">
              <h4>Dirigido a </h4>

              <GetDepartamentos register={register} setIdDepartamento={setIdDepartamento} id_departamento={id_departamento} />
            </div>

            <div className="mb-3 col">
              <h4>Numero de respuestas</h4>
              <input
                className="form-control rounded-pill minimal-input-dark"
                type="number"
                {...register('cantidad_respuesta', {
                  required: {
                    value: true,
                    message: 'Cantidad de respuesta es obligatorio'
                  }
                })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-2 mb-2">
              <Button variant="text" className="m-3" onClick={() => setCheck((prevCheck) => !prevCheck)}>
                {check ? 'Cancelar Observacion' : 'Agregar Observacion'}
              </Button>
            </div>
            {check && (
              <div className="mb-3 col-4">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  className="form-control minimal-input-dark"
                  placeholder="Observaciones Radicado"
                  defaultValue={check ? 'NA' : 'NA'}
                  disabled={!check}
                  {...register('observaciones_radicado')}
                ></textarea>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-success">
            Registrar
          </button>
        </form>
      </MainCard>
    </ComponentSkeleton>
  );
}

export default ComponentRadicados;
