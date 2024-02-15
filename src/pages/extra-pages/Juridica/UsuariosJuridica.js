import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'api/axios';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';
import { useAuth } from 'context/authContext';
import { useForm } from 'react-hook-form';

function UsuariosJuridica({ dataRadicados }) {
  const [users, setUsers] = useState([]);
  const [usuario, setUsuario] = useState('');
  const { user } = useAuth();
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    if (user) {
      apiUsuarios();
    }
  }, [user]);

  const onSubmit = handleSubmit(async () => {
    const alert = await MySwal.fire({
      title: '¿Está seguro de asignar el radicado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, modificar',
      cancelButtonText: 'Cancelar'
    });
    if (alert.isConfirmed) {
      asignar();
    }
  });

  const apiUsuarios = async () => {
    try {
      const departamentoId = user.departamento._id;
      const response = await axios.get(`/departamentos/usuarios_departamento/${departamentoId}`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.log(error);
    }
  };

  const actualizacionEstado = async () => {
    try {
      await axios.put(`/radicados/radicados`, { _id: dataRadicados });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar estado');
      console.error(error);
    }
  };

  const asignar = async () => {
    try {
      const dataPrueba = dataRadicados.map((i) => {
        return { id_usuario: usuario, fecha_asignacion: new Date(), estado_asignacion: 'abierto', id_radicado: i };
      });
      const data = await axios.post(`/asignacion`, dataPrueba);
      if (data) {
        actualizacionEstado();
      } else {
        toast.error('No se creo la asignacion');
      }
    } catch (error) {
      toast.error('Error al asignar');
      console.log(error);
    }
  };

  return (
    <div>
      <Toaster richColors position="top-center" />
      <Box sx={{ alignItems: 'center' }}>
        <form onSubmit={onSubmit}>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <select
                className="form-select"
                {...register('id_usuario', {
                  required: {
                    value: true,
                    message: 'Seleccione un usuario'
                  },
                  onChange: (e) => setUsuario(e.target.value)
                })}
              >
                <option value="">Seleccione un usuario</option>
                {users.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.username}
                  </option>
                ))}
              </select>
              {errors.id_usuario && <span className="inputForm">{errors.id_usuario.message}</span>}
            </div>
            {dataRadicados.length > 0 ? (
              <div>
                <Button type="submit" className="ms-3" variant="outlined">
                  Asignar
                </Button>
              </div>
            ) : (
              <h6>Seleccione una petición</h6>
            )}
          </div>
        </form>
      </Box>
    </div>
  );
}

UsuariosJuridica.propTypes = {
  dataRadicados: PropTypes.array
};

export default UsuariosJuridica;
