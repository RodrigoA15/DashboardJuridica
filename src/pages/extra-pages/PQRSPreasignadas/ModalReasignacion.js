import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'api/axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useAuth } from 'context/authContext';

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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const { user } = useAuth();

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    getDepartamentos();
  }, []);

  const onSubmit = handleSubmit((datos) => {
    reasignacion(datos);
  });

  const getDepartamentos = async () => {
    try {
      const response = await axios.get('/area');
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

  const reasignacion = async (datos) => {
    const alerta = await MySwal.fire({
      title: '¿Esta seguro de reasignar la solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reasignar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal-zindex'
      }
    });

    if (alerta.isConfirmed) {
      try {
        await axios.put(`/radicados/rm/reasignacion_departamento`, {
          _id: data,
          id_departamento: datos.id_departamento
        });
        MySwal.fire({
          title: 'Reasignado correctamente',
          icon: 'success',
          customClass: {
            container: 'swal-zindex'
          }
        });
        handleClose();
        historialCambios();
      } catch (error) {
        MySwal.fire({
          text: 'Ops error de servidor :(',
          icon: 'error',
          customClass: {
            container: 'swal-zindex'
          }
        });
      }
    }
  };

  const historialCambios = async () => {
    try {
      const datos = `El usuario ${user.username} reasigno "Rechazo" la solicitud asignada`;
      await axios.post('/history', {
        observacion: datos
      });
    } catch (error) {
      MySwal.fire({
        text: 'Ops error de servidor  :(',
        icon: 'error',
        customClass: {
          container: 'swal-zindex'
        }
      });
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
            <form onSubmit={onSubmit}>
              <div>
                <h5>Seleccione departamento a reasignar</h5>
                <select
                  className="form-select rounded-pill minimal-input-dark"
                  {...register('id_departamento', { required: 'Seleccione un departamento' })}
                >
                  <option value="">Seleccione un departamento</option>
                  {departamento.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.nombre_departamento}
                    </option>
                  ))}
                </select>
                {errors.id_departamento && <span className="inputForm ">{errors.id_departamento.message}</span>}
              </div>
              <button className="btn btn-outline-danger mt-3" type="submit">
                Reasignar
              </button>
            </form>
          )}
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
