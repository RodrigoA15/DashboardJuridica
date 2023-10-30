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

function UsuariosJuridica({ pendiente }) {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  useEffect(() => {
    if (user) {
      apiUsuarios();
    }
  }, [user]);

  const apiUsuarios = async () => {
    try {
      const response = await axios.get(`/departamentos/usuarios_departamento/${user.departamento}`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.log(error);
    }
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      const MySwal = withReactContent(Swal);
      const result = await MySwal.fire({
        title: '¿Está seguro de asignar el radicado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, modificar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        asignar(data);
        actualizacionEstado();
        toast.success('Asignado Correctamente');
      }
      console.log(data);
    } catch (error) {
      toast.error('Error de servidor');
      console.log(error);
    }
  });

  const actualizacionEstado = async () => {
    try {
      await axios.put(`/radicados/radicados/${pendiente._id}`, {
        estado_radicado: 'Asignados'
      });
    } catch (error) {
      toast.error('Error al actualizar estado');
      console.log(error);
    }
  };

  const asignar = async (data) => {
    try {
      const datos = {
        ...data,
        id_radicado: pendiente._id,
        fecha_asignacion: new Date()
      };
      await axios.post(`/asignacion`, datos);
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
          <div className="row d-flex">
            <div className="col-8">
              <select className="form-select" {...register('id_usuario', { required: 'Seleccione un usuario' })}>
                <option value="">Seleccione un usuario</option>
                {users.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.username}
                  </option>
                ))}
              </select>
              {errors.id_usuario && <span className="inputForm">{errors.id_usuario.message}</span>}
            </div>
            <div className="col-4 justify-content-center">
              <Button className="ms-5" variant="outlined" type="submit">
                Asignar
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </div>
  );
}

UsuariosJuridica.propTypes = {
  pendiente: PropTypes.object.isRequired
};

export default UsuariosJuridica;
