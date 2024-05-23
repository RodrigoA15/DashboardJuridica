import { useEffect } from 'react';
import axios from 'api/axios';
import PropTypes from 'prop-types';

function GetTipificacion({ setIdTipificacion }) {
  useEffect(() => {
    listTipificacion();
  }, []);

  const listTipificacion = async () => {
    try {
      const response = await axios.get('/typification');
      setIdTipificacion(response.data[0]._id);
    } catch (error) {
      console.log(error);
    }
  };
}

export default GetTipificacion;

GetTipificacion.propTypes = {
  setIdTipificacion: PropTypes.func.isRequired
};
