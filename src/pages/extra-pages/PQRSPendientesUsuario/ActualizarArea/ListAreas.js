import { memo } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ApiAreas } from './ApiAreas';
import PropTypes from 'prop-types';
export const ListAreas = memo(({ nameArea, setNameArea, granted }) => {
  const { areas } = ApiAreas();

  return (
    <>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="areas">
          &Aacute;rea
        </label>
        <Dropdown
          value={nameArea}
          options={areas}
          onChange={(e) => setNameArea(e.value)}
          disabled={granted === 'Devuelto'}
          optionLabel="nombre_departamento"
          placeholder="Seleccione área"
        />
      </div>
    </>
  );
});

ListAreas.propTypes = {
  nameArea: PropTypes.object,
  setNameArea: PropTypes.func.isRequired,
  granted: PropTypes.string
};
