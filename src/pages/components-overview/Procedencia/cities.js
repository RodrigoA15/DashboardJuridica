import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';

function Cities({ id_departament, setMunicipio }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    dataCities(id_departament);
  }, [id_departament]);

  const dataCities = async (id_departament) => {
    try {
      const dataCities = await axios.get(`https://api-colombia.com/api/v1/Department/${id_departament.value}/cities`);
      setCities(dataCities.data);
    } catch (error) {
      console.log(error);
    }
  };

  const data = cities.map((city) => ({
    value: city.id,
    label: city.name
  }));

  return (
    <div>
      <Select className="basic-single" name="departament" options={data} onChange={setMunicipio} />
    </div>
  );
}

export default Cities;

Cities.propTypes = {
  id_departament: PropTypes.object,
  setMunicipio: PropTypes.func
};
