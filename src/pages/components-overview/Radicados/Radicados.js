// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from '../ComponentSkeleton';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import GetEntrada from '../CanalEntrada/GetEntrada';
import Buscador from '../Procedencia/Buscador';
import GetTipificacion from '../Tipificacion/GetTipificacion';
import GetEntidad from '../Entidad/GetEntidad';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, Grid } from '../../../../node_modules/@mui/material/index';

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function ComponentRadicados() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({ mode: 'onChange' });

  const [procedencia, setProcedencia] = useState('');
  const [id_departamento, setIdDepartamento] = useState('');
  const [nameCourt, setNameCourt] = useState('');
  const [juzgado, setJuzgados] = useState(null);
  const [check, setCheck] = useState(false);

  const MySwal = withReactContent(Swal);

  const onSubmit = handleSubmit((data) => {
    createRadicado(data);
  });

  const createRadicado = async (data) => {
    try {
      const datos = {
        ...data,
        id_procedencia: procedencia,
        estado_radicado: 'Pre-asignacion',
        id_departamento,
        juzgado
      };
      await axios.post(`/radicados/radicados`, datos);
      MySwal.fire({
        title: 'Creado correctamente',
        icon: 'success'
      });
      reset();
    } catch (error) {
      console.error('Error al crear radicado:', error.response);
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
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={7} lg={8}>
          <MainCard className="border-card card-background">
            <Buscador
              setProcedencia={setProcedencia}
              watch={watch}
              setNameCourt={setNameCourt}
              nameCourt={nameCourt}
              setJuzgados={setJuzgados}
            />
            <hr />
            <form onSubmit={onSubmit}>
              {/* Radicados */}
              <div className="row mb-3">
                <h4>Informaci&oacute;n radicado</h4>
                <div className="mb-3 col">
                  <label htmlFor="label" className="form-label h6">
                    N&uacute;mero radicado*
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-pill minimal-input-dark"
                    id="radicados"
                    {...register('numero_radicado', {
                      required: {
                        value: true,
                        message: 'Número radicado es obligatorio'
                      },
                      minLength: {
                        value: 12,
                        message: 'Número Radicado debe ser mayor a 12 caracteres'
                      }
                    })}
                  />
                  {errors.numero_radicado && <span className="inputForm ">{errors.numero_radicado.message}</span>}
                </div>

                <div className="mb-3 col">
                  <label htmlFor="fecha" className="form-label h6">
                    Fecha radicado*
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-pill minimal-input-dark"
                    id="fecha"
                    {...register('fecha_radicado', {
                      required: {
                        value: true,
                        message: 'Fecha radicado es obligatorio'
                      },
                      valueAsDate: true,

                      validate: (value) => {
                        const añoactual = new Date().getFullYear();
                        const añoReq = new Date(value).getFullYear();
                        const fecha_radicado = new Date(value).getMonth();
                        const fecha_actual = new Date().getMonth();

                        if (fecha_actual - fecha_radicado > 6) {
                          return 'Fecha inválida, las fechas de radicación no pueden ser mayores a 6 meses';
                        } else if (añoReq > añoactual) {
                          return 'Fecha inválida, la fecha de radicación no pueden ser mayor a la fecha actual';
                        }
                      }
                    })}
                  />
                  {errors.fecha_radicado && <span className="inputForm ">{errors.fecha_radicado.message}</span>}
                </div>
              </div>

              <div className="row mb-3">
                <div className="mb-3 col">
                  <label htmlFor="label" className="form-label h6">
                    Canal entrada*
                  </label>
                  <GetEntrada register={register} errors={errors} />
                </div>

                <div className="mb-3 col">
                  <label htmlFor="label" className="form-label h6">
                    Tipificaci&oacute;n*
                  </label>

                  <GetTipificacion register={register} errors={errors} />
                </div>
              </div>

              <div>
                <label htmlFor="label" className="form-label h6">
                  Entidad
                </label>
                <GetEntidad
                  register={register}
                  errors={errors}
                  setIdDepartamento={setIdDepartamento}
                  id_departamento={id_departamento}
                  watch={watch}
                />
              </div>

              <div className="row">
                <div className="col-2 mb-2">
                  <Button variant="text" className="m-3" onClick={() => setCheck((prevCheck) => !prevCheck)}>
                    {check ? 'Cancelar Observación' : 'Agregar Observación'}
                  </Button>
                </div>
                {check && (
                  <div className="mb-3 col-4">
                    <label htmlFor="observaciones">Observaciones*</label>
                    <textarea
                      className="form-control minimal-input-dark"
                      placeholder="Observaciones Radicado"
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
        </Grid>
      </Grid>
    </ComponentSkeleton>
  );
}

export default ComponentRadicados;
