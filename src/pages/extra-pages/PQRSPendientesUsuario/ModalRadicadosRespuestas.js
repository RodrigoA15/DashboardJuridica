import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Toaster } from 'sonner';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useAuth } from 'context/authContext';
import PropTypes from 'prop-types';

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

function ModalRadicadosRespuestas({ opens, handleCloses, respuestas }) {
  const [radicadosRpta, setRadicadosRpta] = useState([]);
  const [countRadicados, setCountRadicados] = useState(0);
  const { user } = useAuth();
  useEffect(() => {
    if (respuestas && respuestas.id_radicado && respuestas.id_radicado.numero_radicado) {
      setRadicadosRpta([]);
      setCountRadicados(0);
      apiRadicadosRespuesta();
    }
  }, [respuestas]);

  const apiRadicadosRespuesta = async () => {
    try {
      const response = await axios.get(`/radicados_respuestas/${user.departamento._id}/${respuestas.id_radicado.numero_radicado}`);
      setRadicadosRpta(response.data);
      setCountRadicados(response.data.length);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const updateEstadoRespondido = async (id_radicado) => {
    try {
      const MySwal = withReactContent(Swal);
      const alert = await MySwal.fire({
        title: 'Esta seguro de responder?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, modificar',
        cancelButtonText: 'Cancelar',
        customClass: {
          container: 'swal-zindex'
        }
      });

      if (alert.isConfirmed) {
        await axios.put(`/radicados/radicados/${id_radicado}`, {
          estado_radicado: 'Respuesta'
        });
        toast.success('Respondido correctamente');
        handleCloses();
      } else {
        toast.error('No se respondio la peticion');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <Modal open={opens} onClose={handleCloses} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {respuestas && (
            <>
              {radicadosRpta &&
                radicadosRpta.map((i) => (
                  <div className="row mb-3" key={i._id}>
                    <ul>
                      <li className="form-label">{i.numero_radicado_respuesta}</li>
                    </ul>
                  </div>
                ))}
              <Button
                variant="contained"
                color="success"
                onClick={() => updateEstadoRespondido(respuestas.id_radicado._id)}
                disabled={respuestas.id_radicado.cantidad_respuesta !== countRadicados}
              >
                Responder
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ModalRadicadosRespuestas;

ModalRadicadosRespuestas.propTypes = {
  opens: PropTypes.bool,
  respuestas: PropTypes.object,
  handleCloses: PropTypes.func
};
