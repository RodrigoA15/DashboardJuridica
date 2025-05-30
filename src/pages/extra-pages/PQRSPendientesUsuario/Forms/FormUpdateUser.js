import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Tooltip, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import axios from 'api/axios';

export const FormUpdateUser = ({ data }) => {
  const [newIdentififcation, setNewIdentification] = useState(null);
  const [newName, setNewName] = useState(null);
  const [newLastName, setNewLastName] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const updateOriginRad = async (pruebaId) => {
    try {
      if (pruebaId === null) return toast.error('Procedencia no valida');
      await axios.put(`/radicados/updated-origin/${data.id_radicado}`, {
        id_procedencia: pruebaId
      });
      cancelUpdateNewName();
    } catch (error) {
      console.log(error);
    }
  };
  const MySwal = withReactContent(Swal);

  const updateOrigin = async () => {
    try {
      const updatedData = {};
      if (newName !== null) updatedData.nombre = newName;
      if (newLastName !== null) updatedData.apellido = newLastName;
      // if (newIdentififcation !== null) updatedData.numero_identificacion = newIdentififcation;

      // Validar si no hay datos para actualizar
      if (Object.keys(updatedData).length === 0) {
        return toast.error('No hay datos válidos para actualizar');
      }
      const alert = await MySwal.fire({
        title: '¿Esta seguro de actualizar usuario?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, agregar',
        customClass: {
          container: 'swal-zindex'
        }
      });

      if (alert.isConfirmed) {
        await axios.put(`/origin/${data.id_procedencia}`, updatedData);
        toast.success('Procedencia actualizada correctamente');
        cancelUpdateNewName();
      } else {
        toast('Cancelado', {
          className: 'text-dark',
          icon: <InfoIcon />
        });
      }
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar la procedencia');
    }
  };

  const searchOrigin = async () => {
    try {
      if (newIdentififcation === null) return toast.error('Ingresa un número de identificación válido');
      const response = await axios.get(`/origin/${newIdentififcation}`);
      const alert = await MySwal.fire({
        title: 'Usuario encontrado!',
        text: 'Si aceptas se actualizara la peticion con la información del usuario encontrado',
        icon: 'success',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, agregar',
        customClass: {
          container: 'swal-zindex'
        }
      });

      const cleanDta = response.data.map((item) => item._id);

      if (alert.isConfirmed) {
        updateOriginRad(cleanDta);
        toast.success('Usuario actualizado correctamente');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setOpenRegister(true);
        toast.error('Usuario no  registrado', {
          duration: 5000
        });
      } else {
        toast.error(error.message);
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchOrigin();
    }
  };
  const createOrigin = async () => {
    try {
      if (newIdentififcation === null || newName === null || newLastName === null) return toast.error('Ingresa valores válidos');
      const alert = await MySwal.fire({
        title: '¿Esta seguro de crear usuario?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, agregar',
        customClass: {
          container: 'swal-zindex'
        }
      });

      if (alert.isConfirmed) {
        const responsePost = await axios.post('/origin', {
          numero_identificacion: newIdentififcation,
          nombre: newName,
          apellido: newLastName
        });
        updateOriginRad(responsePost.data);
        toast.success('Procedencia actualizada correctamente');
      } else {
        toast('Cancelado', {
          className: 'text-dark',
          icon: <InfoIcon />
        });
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const cancelUpdateNewName = () => {
    setUpdated(false);
    setNewName(null);
    setNewLastName(null);
    setOpenRegister(false);
    setNewIdentification(null);
  };
  const activeUpdated = () => {
    setUpdated(true);
  };
  return (
    <>
      <div className="mb-3 row align-items-center">
        <h6>Informaci&oacute;n usuario</h6>
        <div className="col">
          <label className="form-label" htmlFor="name">
            N&uacute;mero identificaci&oacute;n
          </label>
          <Tooltip title="Ingresa n&uacute;mero identificación y pulsa enter para buscar" placement="top" arrow>
            <div className="input-with-icon">
              <span className="icon alert-icon">
                <InfoIcon />
              </span>
              <input
                className="form-control"
                type="number"
                defaultValue={data.numero_identificacion}
                onChange={(e) => setNewIdentification(e.target.value)}
                disabled={!updated}
                onKeyDown={handleKeyPress}
              />
            </div>
          </Tooltip>
        </div>

        <div className="col">
          <label className="form-label" htmlFor="name">
            Nombres
          </label>
          <input
            className="form-control"
            type="text"
            defaultValue={data.nombre_procedencia}
            onChange={(e) => setNewName(e.target.value)}
            disabled={!updated}
          />
        </div>

        <div className="col">
          <label className="form-label" htmlFor="lastname">
            Apellidos
          </label>
          <input
            className="form-control"
            type="text"
            defaultValue={data.apellido_procedencia}
            onChange={(e) => setNewLastName(e.target.value)}
            disabled={!updated}
          />
        </div>

        {!updated && (
          <div className="col-1">
            <Tooltip title="Editar" arrow>
              <IconButton onClick={activeUpdated}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}

        {updated && (
          <div className="col-1">
            <Tooltip title="Cancelar" placement="top" arrow>
              <IconButton aria-label="cancel" color="error" onClick={cancelUpdateNewName}>
                <ClearIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Actualizar" arrow>
              <span>
                <IconButton aria-label="check" color="success" onClick={updateOrigin} disabled={openRegister}>
                  <CheckIcon />
                </IconButton>
              </span>
            </Tooltip>
            {openRegister && (
              <Tooltip title="Crear" placement="top" arrow>
                <IconButton aria-label="cancel" color="warning" onClick={createOrigin}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </>
  );
};

FormUpdateUser.propTypes = {
  data: PropTypes.object
};
