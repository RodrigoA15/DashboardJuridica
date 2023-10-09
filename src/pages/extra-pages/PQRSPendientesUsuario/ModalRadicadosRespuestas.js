import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Toaster } from 'sonner';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

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

function ModalRadicadosRespuestas({ open, handleClose, respuesta }) {
  const [radicadosRpta, setRadicadosRpta] = useState([]);
  const [countRadicados, setCountRadicados] = useState(0);
  useEffect(() => {
    if (respuesta && respuesta.id_radicado && respuesta.id_radicado.numero_radicado) {
      apiRadicadosRespuesta();
    }
  }, [respuesta]);

  const apiRadicadosRespuesta = async () => {
    try {
      const response = await axios.get(`/radicados_respuestas/${respuesta.id_radicado.numero_radicado}`);
      setRadicadosRpta(response.data);
      setCountRadicados(response.data.length);
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
        await axios.put(`radicados/radicados/${id_radicado}`, {
          estado_radicado: 'Respuesta'
        });
        toast.success('Respondido correctamente');
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
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {respuesta && (
            <>
              {radicadosRpta &&
                radicadosRpta.map((i) => (
                  <div className="row mb-3" key={i._id}>
                    <ul>
                      <li>{i.numero_radicado_respuesta}</li>
                    </ul>
                  </div>
                ))}
              <Button
                variant="contained"
                color="success"
                onClick={() => updateEstadoRespondido(respuesta.id_radicado._id)}
                disabled={respuesta.id_radicado.cantidad_respuesta !== countRadicados}
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
