import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';
import { useAuth } from 'context/authContext';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';

const UsuariosJuridica = memo(({ dataRadicados, data, setDataApi, setSelected }) => {
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
    const apiUsuarios = async () => {
      if (!user?.departamento?._id) return;
      try {
        const departamentoId = user.departamento._id;
        const response = await axios.get(`/area/usuarios_departamento/${departamentoId}`);
        setUsers(response.data);
      } catch (error) {
        toast.error('Error al cargar usuarios');
        console.error(error);
      }
    };
    apiUsuarios();
  }, [user]);

  const asignar = async () => {
    try {
      const assignments = dataRadicados.map((radicado) => ({
        id_usuario: usuario,
        fecha_asignacion: new Date(),
        estado_asignacion: 'abierto',
        id_radicado: radicado
      }));
      const response = await axios.post(`/assigned`, assignments);
      if (response) {
        actualizacionEstado();
      } else {
        toast.error('No se pudo crear la asignación');
      }
    } catch (error) {
      toast.error('Error al asignar los radicados');
      console.error(error);
    }
  };

  const actualizacionEstado = async () => {
    try {
      const updatePromises = dataRadicados.map((radicado) => axios.put(`/radicados`, { _id: radicado._id, estado_radicado: 'Asignado' }));
      await Promise.all(updatePromises);

      const updatedIds = new Set(dataRadicados.map((radicado) => radicado._id));
      const newData = data.filter((item) => !updatedIds.has(item._id));
      setDataApi(newData);

      toast.success('Radicados asignados y actualizados correctamente');
      setSelected([]);
    } catch (error) {
      toast.error('Error al actualizar el estado de los radicados');
      console.error(error);
    }
  };

  const onSubmit = handleSubmit(async () => {
    const alert = await MySwal.fire({
      title: '¿Confirmar Asignación?',
      text: `Está a punto de asignar ${dataRadicados.length} radicado(s).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6', // Tailwind blue-500
      cancelButtonColor: '#6B7280' // Tailwind gray-500
    });
    if (alert.isConfirmed) {
      asignar();
    }
  });

  return (
    <div>
      <Toaster richColors position="top-center" />
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <select
              className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              {...register('id_usuario', {
                required: {
                  value: true,
                  message: 'Seleccione un usuario'
                },
                onChange: (e) => setUsuario(e.target.value)
              })}
            >
              <option value="">Seleccione un usuario para asignar</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username}
                </option>
              ))}
            </select>
            {errors.id_usuario && <span className="text-red-500 text-xs mt-1 block">{errors.id_usuario.message}</span>}
          </div>

          {dataRadicados.length > 0 && (
            <button
              type="submit"
              className="flex-shrink-0 px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Asignar
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

UsuariosJuridica.displayName = 'UsuariosJuridica';

UsuariosJuridica.propTypes = {
  dataRadicados: PropTypes.array,
  setDataApi: PropTypes.func,
  data: PropTypes.array,
  setSelected: PropTypes.func
};

export default UsuariosJuridica;
