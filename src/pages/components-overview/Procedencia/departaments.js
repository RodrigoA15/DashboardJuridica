import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function Departaments({ data }) {
  const [departaments, setDepartaments] = useState({ name: '' });

  useEffect(() => {
    allDataDepartaments(data);
  }, [data]);

  const allDataDepartaments = async (data) => {
    try {
      const dataResponse = await axios.get(`https://api-colombia.com/api/v1/Department/${data.departmentId}`);
      setDepartaments(dataResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-md-6">
      <input className="form-control" value={departaments.name} readOnly />
    </div>
  );
}

export default Departaments;

Departaments.propTypes = {
  data: PropTypes.string
};
