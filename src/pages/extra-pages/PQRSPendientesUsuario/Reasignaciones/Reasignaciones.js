//Modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
//Props
import PropTypes from 'prop-types';
import Areas from './Areas';
import { useState } from 'react';
import Entidades from './Entidades';

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
  //Todo capturar errores
  const [error, setError] = useState('');
  const [selectArea, setSelectArea] = useState('');
  return (
    <div>
      <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <form>
            <Entidades setError={setError} />
            <Areas error={error} setError={setError} selectArea={selectArea} setSelectArea={setSelectArea} />
          </form>
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
