import { useState } from 'react';
import axios from 'api/axios';
import { Toaster, toast } from 'sonner';
import { SearchOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { InputAdornment, OutlinedInput } from '../../../../node_modules/@mui/material/index';

function Buscador({ setProcedencia }) {
  const [numero_identificacion, setNumero_identificacion] = useState('');
  const [procedenciaData, setProcedenciaData] = useState([]);
  const [entrada, setEntrada] = useState(false);
  //Estados metodo post
  const [select, setSelect] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipoContacto, setTipoContacto] = useState('');
  const [infoContacto, setInfoContacto] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar la recarga de la página
      GetidentificacionById();
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
      const response = await axios.get(`/procedencia/procedencia/${numero_identificacion}`);
      if (response.data.length > 0) {
        setProcedenciaData(response.data);
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
    apellido: apellido,
    tipo_contacto: tipoContacto,
    info_contacto: infoContacto
  };

  const PostProcedencia = async () => {
    try {
      await axios.post('/procedencia/procedencia', data);
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
          <OutlinedInput
            size="small"
            id="header-search"
            sx={{
              width: '400px',
              border: '1px solid black',
              borderRadius: '5px'
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            }
            placeholder="Busca por numero de identificacion"
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
        </div>

        {entrada === false && (
          <div className="col-2">
            <Button variant="contained" onClick={PostProcedencia}>
              Registrar
            </Button>
          </div>
        )}
        {/* Campos de entrada*/}
        {entrada === true && (
          <div>
            {procedenciaData.map((i) => (
              <div key={i._id} className="row">
                <div className="col mb-3">
                  <label htmlFor="nombre" className="form-label h6">
                    Nombre
                  </label>
                  <input type="text" className="form-control rounded-pill minimal-input-dark" id="nombre" value={i.nombre} readOnly />
                </div>
                <div className="col mb-3">
                  <label htmlFor="label" className="form-label h6">
                    Apellido
                  </label>
                  <input type="text" className="form-control rounded-pill minimal-input-dark" id="apellido" value={i.apellido} readOnly />
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
                <input
                  type="text"
                  className="form-control rounded-pill minimal-input-dark"
                  id="nombre"
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="col mb-3">
                <label htmlFor="label" className="form-label h6">
                  Apellido
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill minimal-input-dark"
                  id="apellido"
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col">
                  <select className="form-select mb-4 rounded-pill minimal-input-dark" onChange={(e) => setTipoContacto(e.target.value)}>
                    <option>Seleccione una opcion de contacto</option>
                    <option value="direccion">Direccion</option>
                    <option value="telefono">Telefono</option>
                    <option value="correo">Correo Electronico</option>
                  </select>
                </div>
                <div className="col">
                  <input
                    className="form-control rounded-pill minimal-input-dark"
                    placeholder="Informacion de contacto"
                    type="text"
                    id="contacto"
                    onChange={(e) => setInfoContacto(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Exc radicados */}
    </div>
  );
}

export default Buscador;
