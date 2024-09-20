import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import LoaderComponent from 'components/LoaderComponent';
export const ConsultarAsignacion = ({ visibleAS, setVisibleAS, dataApi, loader }) => {
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  return (
    <Dialog
      header="Consulta asignaci&oacute;n"
      visible={visibleAS}
      onHide={() => {
        if (!visibleAS) return;
        setVisibleAS(false);
      }}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
    >
      {loader ? (
        <div className="d-flex justify-content-center">
          <LoaderComponent />
        </div>
      ) : (
        <>
          {dataApi.map((item) => (
            <div key={item._id} className="d-flex flex-column">
              <label htmlFor="usuario" className="form-label">
                Responsable
              </label>
              <InputText value={item.usuario} />
              <label htmlFor="fecha_radicado" className="form-label">
                Fecha radicado:{' '}
              </label>
              <InputText value={formatFecha(item.fecha_radicado)} />
              <label htmlFor="fecha_asignacion" className="form-label">
                Fecha asignado:
              </label>
              <InputText value={formatFecha(item.fecha_asignacion)} />
              <label htmlFor="estado_asignacion" className="form-label">
                Estado asignaci&oacute;n:{' '}
              </label>
              <InputText value={item.estado_asignacion} />
              <label htmlFor="estado_radicado" className="form-label">
                Estado radicado:{' '}
              </label>
              <InputText value={item.estado_radicado} />
            </div>
          ))}
        </>
      )}
    </Dialog>
  );
};
ConsultarAsignacion.propTypes = {
  dataApi: PropTypes.string,
  visibleAS: PropTypes.bool,
  setVisibleAS: PropTypes.func,
  loader: PropTypes.bool
};
