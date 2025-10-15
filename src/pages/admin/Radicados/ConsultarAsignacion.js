import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import LoaderComponent from 'components/LoaderComponent';
import { ListadoRespuestas } from './ListadoRespuestas';

export const ConsultarAsignacion = ({ visibleAS, setVisibleAS, dataApi, loader }) => {
  const formatFecha = (fecha) => {
    // Añadimos una comprobación por si la fecha no existe
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  return (
    <Dialog
      header="Consulta de Asignación"
      visible={visibleAS}
      onHide={() => setVisibleAS(false)}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
    >
      {loader ? (
        <div className="flex justify-center p-4">
          <LoaderComponent />
        </div>
      ) : (
        <>
          {dataApi.map((item) => (
            // Contenedor con espaciado vertical para una sola columna
            <div key={item._id} className="space-y-4">
              <div>
                <label htmlFor="responsable" className="block text-sm font-semibold text-gray-600">
                  Responsable
                </label>
                {/* Reemplazamos InputText por un <p> estilizado */}
                <p className="mt-1 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800">{item.usuario || 'N/A'}</p>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-600">
                  Fecha radicado
                </label>
                <p className="mt-1 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800">{formatFecha(item.fecha_radicado)}</p>
              </div>

              <div>
                <label htmlFor="date-assign" className="block text-sm font-semibold text-gray-600">
                  Fecha asignado
                </label>
                <p className="mt-1 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800">{formatFecha(item.fecha_asignacion)}</p>
              </div>

              <div>
                <label htmlFor="status-assign" className="block text-sm font-semibold text-gray-600">
                  Estado asignación
                </label>
                <p className="mt-1 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800">{item.estado_asignacion || 'N/A'}</p>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-600">
                  Estado radicado
                </label>
                <p className="mt-1 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800">{item.estado_radicado || 'N/A'}</p>
              </div>
            </div>
          ))}
          {/* Separador para el listado de respuestas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ListadoRespuestas respuesta={dataApi} />
          </div>
        </>
      )}
    </Dialog>
  );
};

ConsultarAsignacion.propTypes = {
  dataApi: PropTypes.array,
  visibleAS: PropTypes.bool,
  setVisibleAS: PropTypes.func,
  loader: PropTypes.bool
};
