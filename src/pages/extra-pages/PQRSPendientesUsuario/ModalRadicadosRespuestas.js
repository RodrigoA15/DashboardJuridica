import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'api/axios';
import { useFetchAprobations } from 'lib/PQRS/fetchAprobations';
import LoaderComponent from 'components/LoaderComponent';

const SEARCH_STATUS_APROBATION = 'Pendiente aprobacion';

export default function ModalRadicadosRespuestas({ opens, handleCloses, respuestas, setAsignados }) {
  const [radicadosRpta, setRadicadosRpta] = useState([]);
  const [countRadicados, setCountRadicados] = useState(0);
  const [loading, setLoading] = useState(false);
  const { fetchSearchAprobations } = useFetchAprobations();

  const { data = [{ count: 0 }], refetch } = useQuery({
    queryKey: ['search-aprobations', respuestas?.id_radicado, SEARCH_STATUS_APROBATION],
    queryFn: () => fetchSearchAprobations(respuestas?.id_radicado, SEARCH_STATUS_APROBATION),
    enabled: false,
    placeholderData: [{ count: 0 }]
  });

  useEffect(() => {
    if (respuestas?.numero_radicado) {
      resetModalState();
      loadRadicadosRespuestas();
      refetch();
    }
  }, [respuestas, refetch]);

  const resetModalState = useCallback(() => {
    setRadicadosRpta([]);
    setCountRadicados(0);
  }, []);

  const loadRadicadosRespuestas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/answer/radicados_respuestas/${respuestas.numero_radicado}`);
      setRadicadosRpta(data);
      setCountRadicados(data.length);
    } catch (error) {
      toast.error(error.response?.data || 'Error al obtener respuestas');
    } finally {
      setLoading(false);
    }
  }, [respuestas?.numero_radicado]);

  const updateEstadoAsignacion = useCallback(async (asignacion) => {
    try {
      await axios.put(`/assigned/${asignacion._id}`, { estado_asignacion: 'cerrado' });
    } catch {
      console.warn('No se pudo actualizar el estado de la asignación');
    }
  }, []);

  const updateEstadoRespondido = useCallback(async () => {
    const MySwal = withReactContent(Swal);

    const result = await MySwal.fire({
      title: '¿Está seguro de responder?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar',
      customClass: { container: 'swal-zindex' }
    });

    if (!result.isConfirmed) {
      toast.error('Operación cancelada');
      return;
    }

    try {
      await axios.put(`/radicados/${respuestas.id_radicado}`, {
        estado_radicado: 'Respuesta'
      });

      setAsignados((prev) => prev.filter((item) => item._id !== respuestas._id));
      updateEstadoAsignacion(respuestas);
      handleCloses();
      toast.success('Respondido correctamente');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el estado del radicado');
    }
  }, [respuestas, setAsignados, handleCloses, updateEstadoAsignacion]);

  const respuestasPendientes = useMemo(() => data?.[0]?.count || 0, [data]);
  const respuestasEsperadas = respuestas?.cantidad_respuesta || 0;
  const botonDeshabilitado = respuestasEsperadas !== countRadicados || respuestasPendientes > 0;

  return (
    <Dialog
      header="Marcar respuestas"
      visible={opens}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      onHide={handleCloses}
    >
      <div className="flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-2 text-center text-xl font-bold text-gray-800">Respuesta radicado</h2>

          <p className="mb-4 text-center text-gray-600">
            Tienes <strong className="text-gray-900">{countRadicados}</strong> respuestas cargadas de{' '}
            <strong className="text-gray-900">{respuestasEsperadas}</strong> estimadas
          </p>

          <p className="mb-6 text-center text-gray-600">
            Tienes <strong className="text-gray-900">{respuestasPendientes}</strong> respuestas pendientes de aprobación
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoaderComponent />
            </div>
          ) : (
            <>
              {/* Grid de radicados */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {radicadosRpta.map((item, index) => (
                  <div key={item._id} className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                    {index + 1}. {item.numero_radicado_respuesta}
                  </div>
                ))}
              </div>

              {/* Botón de acción */}
              <div className="mt-8 text-center">
                <button
                  onClick={updateEstadoRespondido}
                  disabled={botonDeshabilitado}
                  className="rounded-lg bg-green-600 px-6 py-2 font-bold text-white shadow-md transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70"
                >
                  Responder
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}

ModalRadicadosRespuestas.propTypes = {
  opens: PropTypes.bool.isRequired,
  respuestas: PropTypes.object,
  handleCloses: PropTypes.func.isRequired,
  asignados: PropTypes.array,
  setAsignados: PropTypes.func.isRequired
};
