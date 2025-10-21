import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { useQuery } from '@tanstack/react-query';
import { useFetchAreas } from 'lib/Areas/fetchAreas';

export const SelectAreas = ({ selectedArea, setSelectedArea }) => {
  const { fetchGetAreas } = useFetchAreas();
  const { data, isLoading } = useQuery({
    queryKey: ['areas'],
    queryFn: fetchGetAreas,
    placeholderData: []
  });

  return (
    <Dropdown
      value={selectedArea}
      options={data}
      onChange={(e) => setSelectedArea(e.value)}
      optionLabel="nombre_departamento"
      placeholder="Seleccione área"
      className="w-full md:w-14rem"
      loading={isLoading}
    />
  );
};

SelectAreas.propTypes = {
  selectedArea: PropTypes.object,
  setSelectedArea: PropTypes.func.isRequired
};
