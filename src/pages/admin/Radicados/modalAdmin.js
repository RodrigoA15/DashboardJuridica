import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { AdminGetAreas, AdminGetAffairs, AdminGetEntities, AdminGetStates, UpdateRadicados } from './functionsCrud';

function ModalAdmin({ visible, setVisible, data }) {
  const [cantidadRespuesta, setCantidadRespuesta] = useState('');
  const [entidad, setEntidad] = useState('');
  const [area, setArea] = useState('');
  const [asunto, setAsunto] = useState('');
  const [estadoRadicado, setEstadoRadicado] = useState('');

  // Función para formatear la fecha de manera segura
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  return (
    <Dialog
      header="Editar radicado"
      visible={visible}
      style={{ width: '40vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      onHide={() => setVisible(false)}
      // Añadimos un footer para el botón de acción para una mejor UI
      footer={() => (
        <div className="flex justify-center">
          <UpdateRadicados
            dataId={data}
            cantidadRespuesta={cantidadRespuesta}
            entidad={entidad}
            area={area}
            asunto={asunto}
            estadoRadicado={estadoRadicado}
            setVisible={setVisible}
          />
        </div>
      )}
    >
      {/* El contenido del formulario ahora usa 'p-fluid' para que los inputs se expandan */}
      <div className="p-fluid">
        <form>
          {/* Usamos un grid de Tailwind para organizar los campos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {/* Campo Número radicado */}
            <div>
              <label htmlFor="numero" className="block text-sm font-semibold text-gray-600 mb-2">
                Número radicado
              </label>
              <InputText
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="numero"
                value={data.numero_radicado || ''}
                readOnly
              />
            </div>

            {/* Campo Fecha radicado */}
            <div>
              <label htmlFor="fecha" className="block text-sm font-semibold text-gray-600 mb-2">
                Fecha radicado
              </label>
              <InputText
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="fecha"
                value={formatFecha(data.fecha_radicado)}
                readOnly
              />
            </div>

            {/* Campo Procedencia */}
            <div>
              <label htmlFor="procedencia" className="block text-sm font-semibold text-gray-600 mb-2">
                Procedencia
              </label>
              <InputText
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="procedencia"
                value={data.id_procedencia?.nombre || ''}
                readOnly
              />
            </div>

            {/* Campo Cantidad respuesta */}
            <div>
              <label htmlFor="cantidad" className="block text-sm font-semibold text-gray-600 mb-2">
                Cantidad respuesta
              </label>
              <InputText
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="cantidad"
                keyfilter="int"
                onChange={(e) => setCantidadRespuesta(e.target.value)}
              />
            </div>

            <div>
              <AdminGetEntities setEntidad={setEntidad} entidad={entidad} />
            </div>

            <div>
              <AdminGetAreas setArea={setArea} area={area} entidad={entidad} />
            </div>

            <div>
              <AdminGetAffairs setAsunto={setAsunto} asunto={asunto} area={area} />
            </div>

            <div>
              <AdminGetStates setEstadoRadicado={setEstadoRadicado} estadoRadicado={estadoRadicado} />
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

ModalAdmin.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  // Corregido: 'data' es un objeto, no un string
  data: PropTypes.object
};

export default ModalAdmin;
