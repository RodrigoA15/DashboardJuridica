import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

function Buscador({ setProcedencia, createRadicado }) {
  const [numero_identificacion, setNumero_identificacion] = useState('');
  const [id, setid] = useState([]);
  const [entrada, setEntrada] = useState(false);
  //Estados metodo post
  const [select, setSelect] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar la recarga de la página
      GetidentificacionById();
      PostProcedencia();
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setNumero_identificacion(e.target.value);
  };

  const resetEntrada = () => {
    setEntrada(false);
  };
  const GetidentificacionById = async () => {
    if (numero_identificacion.trim() === '') {
      toast.error('El termino busqueda no puede estar vacio');
    }
    try {
      const response = await axios.get(`http://localhost:4000/api/procedencia/${numero_identificacion}`);
      if (response.data.length > 0) {
        setid(response.data);
        const procedenciaValue = response.data[0]._id;
        setProcedencia(procedenciaValue);
        setEntrada(true);
      } else {
        console.log('No se encontro el usuario  :(', 'error');
        resetEntrada();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Usuario no  registrado');
        resetEntrada();
      } else {
        console.log(error);
      }
    }
  };

  //Data metodo post

  const data = {
    tipo_identificacion: select,
    numero_identificacion: numero_identificacion,
    nombre: nombre,
    apellido: apellido
  };

  const PostProcedencia = async () => {
    try {
      await axios.post('http://localhost:4000/api/procedencia', data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="row ">
        {/* Select */}
        <h4>Informacion Procedencia</h4>

        {/* Buscador */}
        <div className="col-4 input-container">
          <input
            className="form-control mt-4 rounded-pill"
            type="text"
            placeholder="Numero de identificacion"
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />

          <button type="button" className="custom-button" onClick={GetidentificacionById}>
            Buscar
          </button>
        </div>
        {/* Campos de entrada*/}
        {entrada === true && (
          <div>
            {id.map((i) => (
              <div key={i._id} className="row">
                <div className="col mb-3">
                  <label htmlFor="nombre" className="form-label h6">
                    Nombre
                  </label>
                  <input type="text" className="form-control rounded-pill" id="nombre" value={i.nombre} readOnly />
                </div>
                <div className="col mb-3">
                  <label htmlFor="label" className="form-label h6">
                    Apellido
                  </label>
                  <input type="text" className="form-control rounded-pill" id="apellido" value={i.apellido} readOnly />
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          {entrada === false && (
            <div className="row">
              <div className="col-4">
                <select className="form-select mt-4 mb-4 rounded-pill" onChange={(e) => setSelect(e.target.value)}>
                  <option>Seleccione tipo de Identificacion</option>
                  <option value="CC">Cedula de ciudadania</option>
                  <option value="CE">Cedula de extranjeria</option>
                  <option value="PEP">Permiso Especial De Permanencia</option>
                  <option value="PPT">Permiso Proteccion Temporal</option>
                </select>
              </div>
              <div className="col  mb-3">
                <label htmlFor="nombre" className="form-label  h6">
                  Nombre
                </label>
                <input type="text" className="form-control rounded-pill" id="nombre" onChange={(e) => setNombre(e.target.value)} required />
              </div>

              <div className="col mb-3">
                <label htmlFor="label" className="form-label h6">
                  Apellido
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="apellido"
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <button type="button" onClick={createRadicado}>
        Ejecutar PostProcedencia
      </button>
    </div>
  );
}

export default Buscador;
