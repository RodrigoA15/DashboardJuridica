import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { Parameters } from 'hooks/useParameters';
import { FormWithParameter } from './Forms/FormWithParameter';
import { FormWithoutParameter } from './Forms/FormWithoutParameter';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
function ModalRespuestas({ open, handleClose, data, asignados, setAsignados }) {
  const { parameters } = Parameters();
  const parametroActivo = parameters.some((parametro) => parametro.nombre_parametro === 'Asuntos respuesta' && parametro.activo);

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {parametroActivo ? (
            <FormWithParameter data={data} asignados={asignados} setAsignados={setAsignados} handleClose={handleClose} />
          ) : (
            <FormWithoutParameter data={data} handleClose={handleClose} />
          )}
        </Box>
      </Modal>
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
