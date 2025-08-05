import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import GetEntrada from '../CanalEntrada/GetEntrada';
import Buscador from '../Procedencia/Buscador';
import GetTipificacion from '../Tipificacion/GetTipificacion';
import GetEntidad from '../Entidad/GetEntidad';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from '@mui/material';
import { useAuth } from 'context/authContext';
import ModalComponent from './ImportFile/modal';
import { Parameters } from 'hooks/useParameters';
import { FormProvider } from 'react-hook-form';
function ComponentRadicados() {
  const methods = useForm({ mode: 'onChange' });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = methods;

  const { user } = useAuth();
  const [procedencia, setProcedencia] = useState('');
  const [id_tipificacion, setIdTipificacion] = useState('');
  const [nameCourt, setNameCourt] = useState('');
  const [juzgado, setJuzgados] = useState(null);
  const [check, setCheck] = useState(false);
  const MySwal = withReactContent(Swal);
  const onSubmit = handleSubmit((data) => {
    createRadicado(data);
  });
  const { parameters } = Parameters();
  const createRadicado = async (data) => {
    try {
      const datos = {
        ...data,
        id_procedencia: procedencia,
        estado_radicado: 'Pre-asignacion',
        id_tipificacion,
        juzgado
      };

      await axios.post(`/radicados`, datos);
      MySwal.fire({
        title: 'Creado correctamente',
        icon: 'success'
      });
      reset();
      setJuzgados(null);
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.response.data,
        icon: 'info'
      });
    }
  };

  const shouldDisableButton =
    (procedencia === '6579e6f0d99b6ec78c8ca264' && juzgado === null) ||
    (user.role.nombre_rol !== 'Radicador' && user.role.nombre_rol !== 'admin');
  return (
    <div className="container col-sm-7">
      <div className="card justify-content-center">
        <div className="card-body">
          <Buscador
            setProcedencia={setProcedencia}
            watch={watch}
            setNameCourt={setNameCourt}
            nameCourt={nameCourt}
            setJuzgados={setJuzgados}
          />
          <hr />
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              {/* Radicados */}
              <div className="row mb-3">
                <h4>Informaci&oacute;n radicado</h4>
                <div className="mb-3 col">
                  <label htmlFor="numero" className="form-label h6">
                    N&uacute;mero radicado*
                  </label>
                  <input
                    aria-label="radicados"
                    type="number"
                    className="form-control rounded-pill minimal-input-dark"
                    id="radicados"
                    {...register('numero_radicado', {
                      required: {
                        value: true,
                        message: 'Número radicado es obligatorio'
                      },
                      minLength: {
                        value: 14,
                        message: 'Número Radicado debe ser mayor igual a 14 caracteres'
                      },

                      maxLength: {
                        value: 18,
                        message: 'Número Radicado no debe sobrepasar 18 caracteres'
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
                    aria-label="Search"
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
                        const fechaRadicado = new Date(value);
                        const fechaActual = new Date();
                        // Obtener la diferencia en milisegundos entre las dos fechas
                        const diferenciaTiempo = fechaActual - fechaRadicado;
                        // Convertir la diferencia a meses
                        const diferenciaMeses = diferenciaTiempo / (1000 * 60 * 60 * 24 * 30);

                        if (diferenciaMeses > 6) {
                          return 'Fecha inválida, las fechas de radicación no pueden ser mayores a 6 meses';
                        } else if (fechaRadicado > fechaActual) {
                          return 'Fecha inválida, la fecha de radicación no puede ser mayor a la fecha actual';
                        }
                        // Retorna undefined si la fecha es válida
                        return undefined;
                      }
                    })}
                  />
                  {errors.fecha_radicado && <span className="inputForm ">{errors.fecha_radicado.message}</span>}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <GetEntrada register={register} errors={errors} />
                </div>

                <div>
                  <GetEntidad register={register} errors={errors} watch={watch} />
                </div>
              </div>
              <div className="row justify-content-center align-items-center">
                <div className="col-2">
                  <Button variant="text" className="btn-block" onClick={() => setCheck((prevCheck) => !prevCheck)}>
                    {check ? 'Cancelar Observación' : 'Agregar Observación'}
                  </Button>
                </div>
                {check && (
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="observaciones">Observaciones*</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Observaciones Radicado"
                        disabled={!check}
                        {...register('observaciones_radicado')}
                      ></textarea>
                    </div>
                  </div>
                )}
                <div className="col-3">
                  <button type="submit" className="btn btn-success btn-block" disabled={shouldDisableButton}>
                    Registrar
                  </button>
                </div>

                {parameters.map(
                  (parametro) =>
                    parametro.nombre_parametro === 'Importar archivo' &&
                    parametro.activo === true && (
                      <div className="col-3" key={parametro._id}>
                        <ModalComponent />
                      </div>
                    )
                )}
              </div>
            </form>
          </FormProvider>

          <GetTipificacion setIdTipificacion={setIdTipificacion} />
        </div>
      </div>
    </div>
  );
}

export default ComponentRadicados;
