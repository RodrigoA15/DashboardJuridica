import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'api/axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
function UpdateEntidad({ id, setId }) {
  const [nombreEntidad, setNombreEntidad] = useState('');
  const MySwal = withReactContent(Swal);

  const updateAsunto = async () => {
    try {
      const alert = MySwal.fire({
        title: '¿Está seguro de actualizar la entidad?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      });

      if ((await alert).isConfirmed) {
        await axios.put(`/entidad/entidad/${id}`, {
          nombre_entidad: nombreEntidad
        });
        toast.success('Actualizado correctamente');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      toast.error('No se pudo actualizar la entidad', { description: 'Error de servidor ' });
    }
  };

  return (
    <div>
      <input className="form-control" type="text" onChange={(e) => setNombreEntidad(e.target.value)} />
      <button className="btn btn-warning m-2" onClick={() => updateAsunto()}>
        Actualizar
      </button>
      <button className="btn btn-secondary m-2" onClick={() => setId(null)}>
        Cancelar
      </button>
    </div>
  );
}

export default UpdateEntidad;

UpdateEntidad.propTypes = {
  id: PropTypes.string,
  setId: PropTypes.func
};
