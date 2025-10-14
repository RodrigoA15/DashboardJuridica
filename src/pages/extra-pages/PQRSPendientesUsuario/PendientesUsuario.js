import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
import { TabView, TabPanel } from 'primereact/tabview';
//Componentes
import ModalRespuestas from './ModalRespuestas';
import ModalRadicadosRespuestas from './ModalRadicadosRespuestas';
import Reasignaciones from './Reasignaciones/Reasignaciones';
import { TablePendingUser } from './Tables/TablePendingUser';
import { TableAprobations } from './Tables/TableAprobations';

function PendientesUsuario() {
  const { user } = useAuth();
  const [asignados, setAsignados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleRM, setVisibleRM] = useState(false); //Modal Radicados Respuestas
  const [selectedData, setSelectedData] = useState(null);
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
    setVisible(false);
    setSelectedData(null);
  };

  const handleCloseR = () => {
    setSelectedRespuesta(null);
    setVisibleRM(false);
  };

  const handleCloseReasignacion = () => {
    setSelectedAsignacion(null);
    setOpenReasignacion(false);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel header="PQRS pendientes">
          <TablePendingUser
            asignados={asignados}
            setAsignados={setAsignados}
            error={error}
            setOpenReasignacion={setOpenReasignacion}
            setSelectedData={setSelectedData}
            setVisible={setVisible}
            handleClose={handleClose}
            setSelectedRespuesta={setSelectedRespuesta}
            setOpenRespuestasModal={setVisibleRM}
            setSelectedAsignacion={setSelectedAsignacion}
          />
          <ModalRespuestas open={visible} handleClose={handleClose} data={selectedData} setAsignados={setAsignados} asignados={asignados} />
          <ModalRadicadosRespuestas
            setAsignados={setAsignados}
            asignados={asignados}
            opens={visibleRM}
            handleCloses={handleCloseR}
            respuestas={selectedRespuesta}
          />
          <Reasignaciones open={openReasignacion} close={handleCloseReasignacion} asignaciones={selectedAsignacion} />
        </TabPanel>
        <TabPanel header="Aprobaciones">
          <TableAprobations />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default PendientesUsuario;
