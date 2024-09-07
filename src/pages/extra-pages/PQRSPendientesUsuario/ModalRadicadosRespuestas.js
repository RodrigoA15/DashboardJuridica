import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
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

function ModalRadicadosRespuestas({ opens, handleCloses, respuestas, asignados, setAsignados }) {
  const [radicadosRpta, setRadicadosRpta] = useState([]);
  const [countRadicados, setCountRadicados] = useState(0);
  useEffect(() => {
    if (respuestas && respuestas.id_radicado && respuestas.id_radicado.numero_radicado) {
      setRadicadosRpta([]);
      setCountRadicados(0);
      apiRadicadosRespuesta();
    }
  }, [respuestas]);

  const apiRadicadosRespuesta = async () => {
    try {
      const response = await axios.get(`/answer/radicados_respuestas/${respuestas.id_radicado.numero_radicado}`);
      setRadicadosRpta(response.data);
      setCountRadicados(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };
  const updateEstadoAsignacion = async (asignaciones) => {
    try {
      await axios.put(`/assigned/${asignaciones._id}`, {
        estado_asignacion: 'cerrado'
      });
    } catch (error) {
      console.log('No se pudo actualizar');
    }
  };

  const updateEstadoRespondido = async (respuestas) => {
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
        await axios.put(`/radicados/${respuestas.id_radicado._id}`, {
          estado_radicado: 'Respuesta'
        });
        const newData = asignados.filter((item) => item._id !== respuestas._id);
        setAsignados(newData);
        updateEstadoAsignacion(respuestas);
        handleCloses();
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
      <Modal open={opens} onClose={handleCloses} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style} className="scrollbarAnswers">
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
                onClick={() => updateEstadoRespondido(respuestas)}
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
  handleCloses: PropTypes.func,
  asignados: PropTypes.func,
  setAsignados: PropTypes.func
};
