import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from 'context/authContext';

function AdminGetEntities({ setEntidad, entidad }) {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    getAllEntities();
  }, []);

  const getAllEntities = async () => {
    const response = await axios.get('/entity');
    setEntities(response.data);
  };

  return (
    <Dropdown
      value={entidad}
      onChange={(e) => setEntidad(e.value)}
      options={entities}
      optionLabel="nombre_entidad"
      placeholder="Seleccione entidad"
    />
  );
}

AdminGetEntities.propTypes = {
  setEntidad: PropTypes.func.isRequired,
  entidad: PropTypes.object.isRequired
};

function AdminGetAreas({ setArea, area, entidad }) {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (entidad._id) {
      getAllAreas(entidad._id);
    }
  }, [entidad._id]);

  const getAllAreas = async (entityId) => {
    const response = await axios.get(`/area/dptoentidad/${entityId}`);
    setAreas(response.data);
  };

  return (
    <Dropdown
      value={area}
      onChange={(e) => setArea(e.value)}
      options={areas}
      optionLabel="nombre_departamento"
      placeholder="Seleccione área"
    />
  );
}

AdminGetAreas.propTypes = {
  setArea: PropTypes.func.isRequired,
  area: PropTypes.object.isRequired,
  entidad: PropTypes.object.isRequired
};

function AdminGetAffairs({ setAsunto, asunto, area }) {
  const [affairs, setAffairs] = useState([]);

  useEffect(() => {
    if (area._id) getAllAffairs(area._id);
  }, [area._id]);

  const getAllAffairs = async (areaId) => {
    const response = await axios.get(`/affair/asuntos_departamento/${areaId}`);
    setAffairs(response.data);
  };

  return (
    <Dropdown
      value={asunto}
      onChange={(e) => setAsunto(e.value)}
      options={affairs}
      optionLabel="nombre_asunto"
      placeholder="Seleccione asunto"
    />
  );
}

AdminGetAffairs.propTypes = {
  setAsunto: PropTypes.func.isRequired,
  asunto: PropTypes.object.isRequired,
  area: PropTypes.object.isRequired
};

function AdminGetStates({ setEstadoRadicado, estadoRadicado }) {
  const states = [{ name: 'Pre-asignacion' }, { name: 'Pendiente' }, { name: 'Asignados' }, { name: 'Respuesta' }];

  return (
    <Dropdown
      value={estadoRadicado}
      onChange={(e) => setEstadoRadicado(e.value)}
      options={states}
      optionLabel="name"
      placeholder="Seleccione estado"
    />
  );
}

AdminGetStates.propTypes = {
  setEstadoRadicado: PropTypes.func.isRequired,
  estadoRadicado: PropTypes.object.isRequired
};

function UpdateRadicados({ dataId, cantidadRespuesta, entidad, area, asunto, estadoRadicado, setVisible }) {
  const MySwal = withReactContent(Swal);
  const { user } = useAuth();

  const historialCambios = async () => {
    try {
      const datos = `El usuario ${user.username} modifico el radicado ${
        dataId.numero_radicado
      } con fecha de modificacion ${new Date().toLocaleString()}`;
      await axios.post('/history', {
        observacion: datos
      });
    } catch (error) {
      await Myswal.fire({
        text: 'Ops error de servidor  :(',
        icon: 'error',
        customClass: {
          container: 'swal-zindex'
        }
      });
    }
  };

  const updated = async () => {
    try {
      await axios.put(`/radicados/updradicadosAdmin/${dataId._id}`, {
        cantidad_respuesta: cantidadRespuesta,
        id_entidad: entidad._id,
        id_departamento: area._id,
        id_asunto: asunto._id,
        estado_radicado: estadoRadicado.name
      });
      historialCambios();
      setVisible(false);

      await MySwal.fire({
        title: 'Actualizado correctamente',
        icon: 'success'
      });
    } catch (error) {
      setVisible(false);
      await MySwal.fire({
        title: 'Sucedio algo al momento de actualizar el radicado',
        text: error.response.data,
        icon: 'error'
      });
    }
  };

  return (
    <Button variant="contained" onClick={() => updated()}>
      Editar
    </Button>
  );
}

UpdateRadicados.propTypes = {
  dataId: PropTypes.object,
  cantidadRespuesta: PropTypes.object,
  entidad: PropTypes.object,
  area: PropTypes.object,
  asunto: PropTypes.object,
  estadoRadicado: PropTypes.object,
  setVisible: PropTypes.bool
};

export { AdminGetEntities, AdminGetAreas, AdminGetStates, AdminGetAffairs, UpdateRadicados };
