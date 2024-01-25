//Modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
//Props
import PropTypes from 'prop-types';

//Estilos modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function Reasignaciones({ open, close }) {
  return (
    <div>
      <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <p>Coming soon...</p>
        </Box>
      </Modal>
    </div>
  );
}

export default Reasignaciones;

Reasignaciones.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func
};
