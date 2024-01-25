import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';

function UsuariosQX({ setError, selectArea }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(`/departamentos/usuarios_departamento/${selectArea}`);
        setUsers(response.data);
      } catch (error) {
        setError('No se encontraron usuarios');
      }
    };

    getAllUsers();
  }, [selectArea]);

  return (
    <div>
      <select className="form-select">
        <option value="">Seleccione un usuario</option>
        {users.map((usuario) => (
          <option key={usuario._id} value={usuario._id}>
            {usuario.username}
          </option>
        ))}
      </select>
    </div>
  );
}

UsuariosQX.propTypes = {
  setError: PropTypes.func,
  selectArea: PropTypes.string
};

export default UsuariosQX;
