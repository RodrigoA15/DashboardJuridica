import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Cities from './cities';
import PropTypes from 'prop-types';

function Departaments({ setMunicipio }) {
  const [departaments, setDepartaments] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const URL_API = 'https://api-colombia.com/api/v1/Department';
  useEffect(() => {
    allDataDepartaments();
  }, []);

  const allDataDepartaments = async () => {
    try {
      const dataResponse = await axios.get(URL_API);
      setDepartaments(dataResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const data = departaments.map((departament) => ({ value: departament.id, label: departament.name }));
  return (
    <div className="d-flex align-items-start">
      <div className="col-md-6">
        <Select className="basic-single" name="departament" options={data} onChange={setSelectedOption} />
      </div>
      <div className="col-md-6">
        <Cities id_departament={selectedOption} setMunicipio={setMunicipio} />
      </div>
    </div>
  );
}

export default Departaments;

Departaments.propTypes = {
  setMunicipio: PropTypes.func
};
