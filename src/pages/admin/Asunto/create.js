import React, { useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
function Crearasunto({ openPost, valueDP }) {
  const [nombre_asunto, setNombre_asunto] = useState('');
  const [validacionInput, setValidacionInput] = useState('');
  const sendAsunto = async () => {
    try {
      if (!nombre_asunto) {
        return setValidacionInput('Nombre asunto es obligatorio');
      } else {
        setValidacionInput('');
      }
      const MySwal = withReactContent(Swal);
      const alert = await MySwal.fire({
        title: 'Está seguro de crear el asunto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
      });

      if (alert.isConfirmed) {
        await axios.post('/affair', {
          id_departamento: valueDP,
          nombre_asunto: nombre_asunto
        });
        toast.success('Creado Correctamente');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      toast.error('Error de servidor', { description: 'No se pudo crear el asunto' });
    }
  };
  return (
    <div>
      {openPost && (
        <div className="row mt-3">
          <div className="col">
            <input className="form-control" placeholder="Nombre asunto*" onChange={(e) => setNombre_asunto(e.target.value)} />
            <span className="errors">{validacionInput}</span>
          </div>
          <div className="col">
            <button className="btn btn-success" onClick={() => sendAsunto()}>
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crearasunto;

Crearasunto.propTypes = {
  valueDP: PropTypes.string,
  openPost: PropTypes.bool
};
