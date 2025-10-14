import { useForm, FormProvider } from 'react-hook-form';
import axios from 'api/axios';
import GetEntrada from '../CanalEntrada/GetEntrada';
import Buscador from '../Procedencia/Buscador';
import GetTipificacion from '../Tipificacion/GetTipificacion';
import GetEntidad from '../Entidad/GetEntidad';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from 'context/authContext';
import ModalComponent from './ImportFile/modal';
import { useParameters } from 'hooks/useParameters';

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

  const { parameters } = useParameters();

  const onSubmit = handleSubmit(async (data) => {
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
        title: '¡Creado exitosamente!',
        icon: 'success',
        confirmButtonColor: '#34D399' // Verde esmeralda
      });
      reset();
      setJuzgados(null);
    } catch (error) {
      MySwal.fire({
        title: '¡Ups! Algo salió mal',
        text: error.response.data,
        icon: 'error',
        confirmButtonColor: '#F87171' // Rojo claro
      });
    }
  });

  const shouldDisableButton =
    (procedencia === '6579e6f0d99b6ec78c8ca264' && juzgado === null) ||
    (user.role.nombre_rol !== 'Radicador' && user.role.nombre_rol !== 'admin');

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="bg-white shadow-xl rounded-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <Buscador
            setProcedencia={setProcedencia}
            watch={watch}
            setNameCourt={setNameCourt}
            nameCourt={nameCourt}
            setJuzgados={setJuzgados}
          />

          <hr className="border-gray-200" />

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Radicado</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Número de Radicado */}
                  <div>
                    <label htmlFor="numero_radicado" className="block text-sm font-semibold text-gray-600 mb-2">
                      Número radicado*
                    </label>
                    <input
                      id="numero_radicado"
                      type="number"
                      className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      {...register('numero_radicado', {
                        required: { value: true, message: 'El número de radicado es obligatorio' },
                        minLength: { value: 14, message: 'Debe tener al menos 14 caracteres' },
                        maxLength: { value: 18, message: 'No debe exceder los 18 caracteres' }
                      })}
                    />
                    {errors.numero_radicado && <span className="text-red-500 text-xs mt-2 block">{errors.numero_radicado.message}</span>}
                  </div>

                  {/* Fecha de Radicado */}
                  <div>
                    <label htmlFor="fecha_radicado" className="block text-sm font-semibold text-gray-600 mb-2">
                      Fecha radicado*
                    </label>
                    <input
                      id="fecha_radicado"
                      type="date"
                      className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      {...register('fecha_radicado', {
                        required: { value: true, message: 'La fecha es obligatoria' },
                        validate: (value) => {
                          const fechaRadicado = new Date(value);
                          const fechaActual = new Date();
                          if (fechaRadicado > fechaActual) return 'La fecha no puede ser futura';
                          const seisMesesAtras = new Date();
                          seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
                          if (fechaRadicado < seisMesesAtras) return 'La fecha no puede tener más de 6 meses de antigüedad';
                          return true;
                        }
                      })}
                    />
                    {errors.fecha_radicado && <span className="text-red-500 text-xs mt-2 block">{errors.fecha_radicado.message}</span>}
                  </div>
                </div>
              </div>

              <GetEntrada register={register} errors={errors} />
              <GetEntidad register={register} errors={errors} watch={watch} />
              <GetTipificacion setIdTipificacion={setIdTipificacion} />

              {/* Sección de Observaciones y Acciones */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCheck(!check)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {check ? 'Ocultar Observaciones' : 'Agregar Observación'}
                  </button>
                </div>

                {check && (
                  <div>
                    <label htmlFor="observaciones" className="block text-sm font-semibold text-gray-600 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      id="observaciones"
                      rows="3"
                      placeholder="Escribe aquí cualquier detalle adicional..."
                      className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      {...register('observaciones_radicado')}
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={shouldDisableButton}
                  className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Registrar Radicado
                </button>
                {parameters.map(
                  (param) =>
                    param.nombre_parametro === 'Importar archivo' &&
                    param.activo && (
                      <div key={param._id}>
                        <ModalComponent />
                      </div>
                    )
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default ComponentRadicados;
