import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import Modal from '@mui/material/Modal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

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
        console.log(respuestas._id);
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
  // let count = 1;

  return (
    <>
      <Modal open={opens} onClose={handleCloses} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: '80%', maxWidth: '800px' }}>
            <p>
              Pulse tecla <b>Esc</b> para salir
            </p>
            <h5 className="mb-4 text-center">Respuesta radicado</h5>
            <p className="text-center">
              Tienes <b>{countRadicados}</b> respuestas cargadas de{' '}
              <b>{respuestas ? respuestas.id_radicado.cantidad_respuesta : 0} estimadas</b>
            </p>
            {respuestas && (
              <>
                <div className="row">
                  {radicadosRpta &&
                    radicadosRpta.map((i, index) => (
                      <div className="col-12 col-sm-6 col-md-4 mb-3" key={i._id}>
                        <ol className="list-group">
                          <li className="list-group-item">
                            {index + 1}. {i.numero_radicado_respuesta}
                          </li>
                        </ol>
                      </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                  <button
                    className="btn btn-success"
                    onClick={() => updateEstadoRespondido(respuestas)}
                    disabled={respuestas.id_radicado.cantidad_respuesta !== countRadicados}
                  >
                    Responder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalRadicadosRespuestas;

ModalRadicadosRespuestas.propTypes = {
  opens: PropTypes.bool,
  respuestas: PropTypes.object,
  handleCloses: PropTypes.func,
  asignados: PropTypes.array,
  setAsignados: PropTypes.func
};
