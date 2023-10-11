// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
// import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'api/axios';
import GetEntrada from './CanalEntrada/GetEntrada';
import Buscador from './Procedencia/Buscador';
import GetAsunto from './Asunto/GetAsunto';
import GetTipificacion from './Tipificacion/GetTipificacion';
import GetEntidad from './Entidad/GetEntidad';
import GetDepartamentos from './Departamento/GetDepartamentos';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function ComponentRadicados() {
  const [numero_radicado, setNumero_radicado] = useState('');
  const [fecha_radicado, setFecha_radicado] = useState('');
  //Canal Entrada
  const [canalEntrada, setCanalEntrada] = useState('');
  //Asunto
  const [asunto, setAsunto] = useState('');
  //Tipificacion
  const [tipificacion, setTipificacion] = useState('');
  //Entidad
  const [entidad, setEntidad] = useState('');
  //Procedencia
  const [procedencia, setProcedencia] = useState('');
  //Departamentos
  const [departamento, setDepartamento] = useState('');
  //Numero de respuestas
  const [respuesta, setRespuesta] = useState('');

  const MySwal = withReactContent(Swal);
  const datos = {
    numero_radicado: numero_radicado,
    fecha_radicado: fecha_radicado,
    id_canal_entrada: canalEntrada,
    id_asunto: asunto,
    id_tipificacion: tipificacion,
    id_entidad: entidad,
    id_procedencia: procedencia,
    id_departamento: departamento,
    estado_radicado: 'Pre-asignacion',
    cantidad_respuesta: respuesta
  };

  const createRadicado = async () => {
    try {
      await axios.post(`/radicados/radicados`, datos);
      MySwal.fire({
        title: 'Creado correctamente',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error al crear radicado:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear radicado';
      MySwal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
    }
  };

  return (
    <ComponentSkeleton>
      <MainCard title="Crear Radicados" className="border-card card-background">
        <form>
          <Buscador createRadicado={createRadicado} setProcedencia={setProcedencia} />

          {/* Radicados */}
          <div className="row mb-3">
            <h4>Informacion Radicado</h4>
            <div className="mb-3 col">
              <label htmlFor="label" className="form-label h6">
                Numero radicado
              </label>
              <input
                type="number"
                className="form-control rounded-pill minimal-input-dark"
                id="radicados"
                onChange={(e) => setNumero_radicado(e.target.value)}
              />
            </div>

            <div className="mb-3 col">
              <label htmlFor="fecha" className="form-label h6">
                Fecha Radicado
              </label>
              <input
                type="date"
                className="form-control rounded-pill minimal-input-dark"
                id="fecha"
                onChange={(e) => setFecha_radicado(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h4>Canal Entrada</h4>

              <GetEntrada setCanalEntrada={setCanalEntrada} />
            </div>

            <div className="mb-3 col">
              <h4>Tipificacion</h4>

              <GetTipificacion setTipificacion={setTipificacion} />
            </div>

            <div className="mb-3 col">
              <h4>Asunto</h4>

              <GetAsunto setAsunto={setAsunto} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="mb-3 col">
              <h4>Entidad</h4>

              <GetEntidad setEntidad={setEntidad} />
            </div>

            <div className="mb-3 col">
              <h4>Dirigido a </h4>

              <GetDepartamentos setDepartamento={setDepartamento} />
            </div>

            <div className="mb-3 col">
              <h4>Numero de respuestas</h4>
              <input
                className="form-control rounded-pill minimal-input-dark"
                type="number"
                onChange={(e) => setRespuesta(e.target.value)}
              />
            </div>
          </div>
          <button type="button" className="btn btn-success" onClick={createRadicado}>
            Registrar
          </button>
        </form>
      </MainCard>
    </ComponentSkeleton>
  );
}

export default ComponentRadicados;
