import React, { useState, useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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

function ModalUsuarios({ open, handleClose, data }) {
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const [dataRoles, setDataRoles] = useState([]);
  const [roles, setRoles] = useState('');

  useEffect(() => {
    apiDataDepartamentos();
    apiDataRoles();
  }, []);

  const apiDataDepartamentos = async () => {
    try {
      const response = await axios.get('/area');
      setDataDepartamento(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron áreas');
      } else {
        toast.error('error de servidor');
      }
    }
  };

  const apiDataRoles = async () => {
    try {
      const response = await axios.get('/role');
      setDataRoles(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No se encontraron roles');
      } else {
        toast.error('error de servidor');
      }
    }
  };

  const updateUserQx = async () => {
    const MySwal = withReactContent(Swal);
    const alert = await MySwal.fire({
      title: '¿Está seguro de realizar la asignación?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, asignar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal-zindex'
      }
    });

    if (alert.isConfirmed) {
      try {
        const siu = {};

        if (departamento) {
          siu.departamento = departamento;
        }

        if (roles) {
          siu.role = roles;
        }

        await axios.put(`/usersQX/${data._id}`, siu);

        handleClose();
        toast.success('Asignado Correctamente');
      } catch (error) {
        toast.error('Error de servidor', {
          description: 'No se pudo realizar la asignacion'
        });
      }
    }
  };

  const handleDepartamentos = (e) => {
    setDepartamento(e.target.value);
  };

  const handleRoles = (e) => {
    setRoles(e.target.value);
  };

  const handleButtononClick = (e) => {
    updateUserQx();
    e.preventDefault();
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {data && (
            <form>
              <div>
                <select className="form-select m-1" onChange={handleDepartamentos}>
                  <option>Selecione un área</option>
                  {dataDepartamento.map((departamentos) => (
                    <option key={departamentos._id} value={departamentos._id}>
                      {departamentos.nombre_departamento}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select className="form-select m-1" onChange={handleRoles}>
                  <option>Seleccione rol</option>
                  {dataRoles.map((rol) => (
                    <option key={rol._id} value={rol._id}>
                      {rol.nombre_rol}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn btn-warning mt-3" type="submit" onClick={handleButtononClick}>
                Asignar
              </button>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ModalUsuarios;

ModalUsuarios.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object
};
