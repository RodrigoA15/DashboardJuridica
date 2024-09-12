import { memo } from 'react';
import { ApiAreas } from './ApiAreas';
import PropTypes from 'prop-types';
export const ListAreas = memo(({ setNameArea, granted }) => {
  const { areas } = ApiAreas();

  const handleSubmit = (e) => {
    setNameArea(e.target.value);
  };

  return (
    <>
      <select className="form-select mb-3" onChange={handleSubmit} disabled={granted === 'Devuelto'}>
        <option value="">Seleccione &aacute;rea</option>
        {areas.map((area) => (
          <option key={area._id} value={area._id}>
            {area.nombre_departamento}
          </option>
        ))}
      </select>
    </>
  );
});

ListAreas.propTypes = {
  setNameArea: PropTypes.func.isRequired,
  granted: PropTypes.string
};
