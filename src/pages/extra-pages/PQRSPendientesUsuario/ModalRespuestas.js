import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';
import { useParameters } from 'hooks/useParameters';
import { FormWithParameter } from './Forms/FormWithParameter';
import { FormWithoutParameter } from './Forms/FormWithoutParameter';
function ModalRespuestas({ open, handleClose, data, asignados, setAsignados }) {
  const { parameters } = useParameters();
  const parametroActivo = parameters.some((parametro) => parametro.nombre_parametro === 'Asuntos respuesta' && parametro.activo);

  return (
    <>
      <Dialog
        header="Cargue de respuestas"
        visible={open}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        onHide={() => {
          if (!open) return;
          handleClose();
        }}
      >
        {parametroActivo ? (
          <FormWithParameter data={data} asignados={asignados} setAsignados={setAsignados} handleClose={handleClose} />
        ) : (
          <FormWithoutParameter data={data} handleClose={handleClose} />
        )}
      </Dialog>
    </>
  );
}

export default ModalRespuestas;

ModalRespuestas.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object,
  handleClose: PropTypes.func,
  asignados: PropTypes.array,
  setAsignados: PropTypes.func
};
