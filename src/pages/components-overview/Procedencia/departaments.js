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
    <div className="md:col-span-2">
      <label htmlFor="city" className="block text-sm font-semibold text-gray-600 mb-2 mt-2">
        Departamento
      </label>
      <input
        className="w-full px-4 py-2 mt-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={departaments.name}
        readOnly
      />
    </div>
  );
}

export default Departaments;

Departaments.propTypes = {
  data: PropTypes.string
};
