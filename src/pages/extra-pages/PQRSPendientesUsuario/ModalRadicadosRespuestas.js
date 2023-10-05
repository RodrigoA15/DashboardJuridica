import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Toaster } from '../../../../node_modules/sonner/dist/index';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';

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
  useEffect(() => {
    if (respuesta && respuesta.id_radicado && respuesta.id_radicado.numero_radicado) {
      apiRadicadosRespuesta();
    }
  }, [respuesta]);

  const apiRadicadosRespuesta = async () => {
    try {
      const response = await axios.get(`/radicados_respuestas/${respuesta.id_radicado.numero_radicado}`);
      setRadicadosRpta(response.data);
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
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ModalRadicadosRespuestas;
