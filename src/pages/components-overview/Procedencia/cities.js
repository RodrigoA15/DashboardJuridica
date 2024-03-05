import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Departaments from './departaments';

function Cities({ setMunicipio, municipio }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    dataCities();
  }, []);

  const dataCities = async () => {
    try {
      const dataCities = await axios.get(`https://api-colombia.com/api/v1/City`);
      setCities(dataCities.data);
    } catch (error) {
      console.log(error);
    }
  };

  const data = cities.map((city) => ({
    value: city.id,
    label: city.name,
    departmentId: city.departmentId
  }));

  return (
    <div className="d-flex align-items-start">
      <Select className="basic-single col-md-6" name="departament" options={data} onChange={setMunicipio} />
      <Departaments data={municipio} />
    </div>
  );
}

export default Cities;

Cities.propTypes = {
  id_departament: PropTypes.object,
  setMunicipio: PropTypes.func,
  municipio: PropTypes.string
};
