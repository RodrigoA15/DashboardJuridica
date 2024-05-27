import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

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
      className="w-20"
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
  const states = [{ name: 'Pre-asignación' }, { name: 'Pendiente' }, { name: 'Asignados' }, { name: 'Respuesta' }];

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

function UpdateRadicados({ dataId, cantidadRespuesta, entidad, area, asunto, estadoRadicado }) {
  const updated = async () => {
    await axios.put(`/radicados/updradicadosAdmin/${dataId}`, {
      cantidad_respuesta: cantidadRespuesta,
      id_entidad: entidad._id,
      id_departamento: area._id,
      id_asunto: asunto._id,
      estado_radicado: estadoRadicado.name
    });
  };

  return (
    <Button variant="contained" onClick={updated}>
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
  estadoRadicado: PropTypes.object
};

export { AdminGetEntities, AdminGetAreas, AdminGetStates, AdminGetAffairs, UpdateRadicados };
