import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Button } from '@mui/material';

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

function ModalReasignacion({ open, handleClose, data }) {
  const [departamento, setDepartamento] = useState([]);
  const [selectDepartamento, setSelectedDeparmento] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDepartamentos();
  }, []);

  const getDepartamentos = async () => {
    try {
      const response = await axios.get('/departamentos/departamento');
      setDepartamento(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS preasignadas');
      } else {
        setError('Error de servidor');
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  const reasignacion = async () => {
    try {
      console.log(selectDepartamento);
      await axios.put(`/radicados/reasignacion_departamento/${data._id}`, {
        id_departamento: selectDepartamento
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {isLoading ? (
            <div key="loading">
              <p colSpan={5}>Cargando...</p>
            </div>
          ) : error ? (
            <div key="error">
              <p colSpan={5}>{error}</p>
            </div>
          ) : (
            <form>
              <div>
                <h5>Seleccione departamento a reasignar</h5>
                <select className="form-select rounded-pill minimal-input-dark" onChange={(e) => setSelectedDeparmento(e.target.value)}>
                  <option>Seleccione un departamento</option>
                  {departamento.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.nombre_departamento}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          )}
          <Button onClick={() => reasignacion()}>Reasignar</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalReasignacion;

ModalReasignacion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object
};
