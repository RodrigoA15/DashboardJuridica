import React, { useState } from 'react';
import axios from 'api/axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';

function CrearEntidad() {
  const [nombreEntidad, setNombreEntidad] = useState('');
  const MySwal = withReactContent(Swal);

  const createEntidad = async () => {
    try {
      const alert = await MySwal.fire({
        title: '¿Está seguro de crear la entidad?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, crear'
      });

      if (alert.isConfirmed) {
        await axios.post('/entidad/entidad', {
          nombre_entidad: nombreEntidad
        });
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <div className="row m-3">
        <div className="col-8">
          <input className="form-control width=100px" placeholder="Nombre entidad" onChange={(e) => setNombreEntidad(e.target.value)} />
        </div>
        <div className="col">
          <button className="btn btn-success" onClick={() => createEntidad()}>
            Crear
          </button>
        </div>
      </div>
    </>
  );
}

export default CrearEntidad;
