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

  return (
    <div>
      <Dialog
        header="Editar radicado"
        visible={visible}
        style={{ width: '40vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="container d-flex justify-content-center align-items-center">
          <form>
            {/* row1 */}
            <div className="row">
              <div className="mb-4 col-6">
                <label htmlFor="numero">Número radicado</label>
                <InputText value={data.numero_radicado} />
              </div>
              <div className="mb-4 col-6">
                <label htmlFor="fecha">Fecha radicado</label>
                <InputText value={new Date(data.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })} />
              </div>
            </div>
            {/* row2 */}
            <div className="row">
              <div className="mb-4 col-6">
                <label htmlFor="procedencia">Procedencia</label>
                <InputText value={data.id_procedencia && data.id_procedencia.nombre} />
              </div>
              <div className="mb-4 col-6">
                <label htmlFor="cantidad">Cantidad respuesta</label>
                <InputText keyfilter="int" onChange={(e) => setCantidadRespuesta(e.target.value)} />
              </div>
            </div>
            {/* row3 */}
            <div className="row">
              <div className="mb-4 col-6">
                <AdminGetEntities setEntidad={setEntidad} entidad={entidad} />
              </div>
              <div className="mb-4 col-6">
                <AdminGetAreas setArea={setArea} area={area} entidad={entidad} />
              </div>
            </div>
            {/* row4 */}
            <div className="row">
              <div className="mb-4 col-6">
                <AdminGetAffairs setAsunto={setAsunto} asunto={asunto} area={area} />
              </div>
              <div className="mb-4 col-6">
                <AdminGetStates setEstadoRadicado={setEstadoRadicado} estadoRadicado={estadoRadicado} />
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center">
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
          </form>
        </div>
      </Dialog>
    </div>
  );
}

export default ModalAdmin;

ModalAdmin.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  data: PropTypes.string
};
