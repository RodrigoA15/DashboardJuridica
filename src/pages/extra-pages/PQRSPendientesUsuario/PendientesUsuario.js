import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
//Componentes
import ModalRespuestas from './ModalRespuestas';
import ModalRadicadosRespuestas from './ModalRadicadosRespuestas';
import Reasignaciones from './Reasignaciones/Reasignaciones';
import { TablePendingUser } from './Tables/TablePendingUser';

function PendientesUsuario() {
  const { user } = useAuth();
  const [asignados, setAsignados] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [openRespuestasModal, setOpenRespuestasModal] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState(null);
  const [error, setError] = useState('');
  //Modal Reasignacion
  const [openReasignacion, setOpenReasignacion] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);

  useEffect(() => {
    {
      user && apiDataUser();
    }
  }, [user]);

  //TODO consumo de api asignaciones
  const apiDataUser = async () => {
    try {
      const response = await axios.get(`/assigned/users/${user._id}`);
      setAsignados(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS asignadas');
      }
    }
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpenModal(false);
  };

  const handleCloseR = () => {
    setSelectedRespuesta(null);
    setOpenRespuestasModal(false);
  };

  const handleCloseReasignacion = () => {
    setSelectedAsignacion(null);
    setOpenReasignacion(false);
  };

  return (
    <div className="card">
      <TablePendingUser
        asignados={asignados}
        error={error}
        setOpenReasignacion={setOpenReasignacion}
        setSelectedData={setSelectedData}
        setOpenModal={setOpenModal}
        handleClose={handleClose}
        setSelectedRespuesta={setSelectedRespuesta}
        setOpenRespuestasModal={setOpenRespuestasModal}
        setSelectedAsignacion={setSelectedAsignacion}
      />
      <ModalRespuestas open={openModal} handleClose={handleClose} data={selectedData} setAsignados={setAsignados} asignados={asignados} />
      <ModalRadicadosRespuestas
        setAsignados={setAsignados}
        asignados={asignados}
        opens={openRespuestasModal}
        handleCloses={handleCloseR}
        respuestas={selectedRespuesta}
      />
      <Reasignaciones open={openReasignacion} close={handleCloseReasignacion} asignaciones={selectedAsignacion} />
    </div>
  );
}

export default PendientesUsuario;
