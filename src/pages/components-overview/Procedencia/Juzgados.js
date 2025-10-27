import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useAuth } from 'context/authContext';
import Cities from './cities';
import AsyncSelect from 'react-select/async';

function Juzgados({ setNameCourt, nameCourt, setJuzgados }) {
  const [validation, setValidation] = useState('');
  //Crear entes juridcos manuales
  const [data, setData] = React.useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [registerEntity, setRegisterEntity] = useState(false);
  const Myswal = withReactContent(Swal);
  const { user } = useAuth();

  useEffect(() => {
    apiDataEntidad();
    setDescripcion(nameCourt);
  }, [nameCourt]);

  const apiDataEntidad = async () => {
    try {
      const response = await axios.get('/legal');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dataApiCourtsMongo = async () => {
    try {
      const trimmedMunicipio = municipio.label.trim();
      const trimmedDescripcion = nameCourt.label.trim();
      const response = await axios.get(`/legal/${trimmedDescripcion}/${trimmedMunicipio}`);
      const id_juzgado = response.data.response._id;
      setJuzgados(id_juzgado);
      setRegisterEntity(false);
      const message = response.data.message;
      setValidation(message);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const message = error.response.data.message;
        setValidation(message);
        setRegisterEntity(true);
      }
    }
  };

  const registerEntityApi = async () => {
    try {
      const alert = await Myswal.fire({
        text: '¿Está seguro de crear la entidad jurídica?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
      });

      if (alert.isConfirmed) {
        // Elimina espacios en blanco al principio y al final de las cadenas
        const trimmedDescripcion = nameCourt.label.trim();
        const trimmedMunicipio = municipio.label.trim();

        await axios.post('/legal', {
          desc_ente_juridico: trimmedDescripcion,
          municipio: trimmedMunicipio
        });

        await Myswal.fire({
          text: 'Entidad creada correctamente',
          icon: 'success'
        });

        dataApiCourtsMongo();
      } else {
        await Myswal.fire({
          text: 'Cancelado',
          icon: 'warning'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const historialCambios = async () => {
    try {
      const datos = `El usuario ${user.username} creo la entidad juridica: ${descripcion.label} del municipio de ${municipio.label}`;
      await axios.post('/history', [
        {
          id_usuario: user._id,
          observacion: datos,
          fecha_modifica: new Date()
        }
      ]);
    } catch (error) {
      Myswal.fire({
        text: 'Ops error de servidor  :(',
        icon: 'error',
        customClass: {
          container: 'swal-zindex'
        }
      });
    }
  };

  const handleOnClick = () => {
    historialCambios();
    registerEntityApi();
  };

  const filterColors = (inputValue) => {
    return data
      .filter((i) => i.desc_ente_juridico.toLowerCase().includes(inputValue.toLowerCase()))
      .map((i) => ({
        label: i.desc_ente_juridico,
        value: i._id
      }));
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterColors(inputValue));
    }, 1000);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="desc_entidad">
            Nombre Entidad
          </label>
          <AsyncSelect
            className="basic-single"
            classNamePrefix="select"
            cacheOptions
            loadOptions={loadOptions}
            onChange={setNameCourt}
            noOptionsMessage={({ inputValue }) => (!inputValue ? '...' : `No hay ${inputValue}`)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="municipio">
            Municipio
          </label>
          <Cities setMunicipio={setMunicipio} municipio={municipio} />
        </div>
      </div>

      <div className="mt-4">
        {validation && <span className="text-red-500 text-xs block mb-2">{validation}</span>}

        {!municipio.label ? (
          <span className="text-red-500 text-xs block">Municipio es requerido</span>
        ) : (
          <button
            type="button"
            onClick={dataApiCourtsMongo}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Buscar
          </button>
        )}
      </div>

      {registerEntity && (
        <div className="flex flex-col items-center mt-6 pt-6 border-t border-gray-200 space-y-4">
          <input
            className="w-full max-w-md px-4 py-2 bg-gray-100 border border-transparent rounded-lg text-gray-700 text-center"
            value={nameCourt.label}
            readOnly
          />
          <input
            className="w-full max-w-md px-4 py-2 bg-gray-100 border border-transparent rounded-lg text-gray-700 text-center"
            value={municipio.label}
            readOnly
          />
          <button
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleOnClick}
          >
            Registrar
          </button>
        </div>
      )}
    </div>
  );
}

export default Juzgados;

Juzgados.propTypes = {
  setNameCourt: PropTypes.func.isRequired,
  setJuzgados: PropTypes.func.isRequired,
  nameCourt: PropTypes.string.isRequired
};
