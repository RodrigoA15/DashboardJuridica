import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from 'context/authContext';
import { useFetchPendientes } from 'lib/PQRS/fetchPendientes.js';
export const SelectUserByArea = ({ selectedUser, setSelectedUser }) => {
  const { user } = useAuth();
  const { fetchUsersByArea } = useFetchPendientes();

  // Extraemos solo los IDs de los departamentos para la consulta
  const departamentosIds = user?.departamento?.map((d) => d._id) || [];

  const { data, isLoading } = useQuery({
    queryKey: ['users-area', departamentosIds],
    queryFn: () => fetchUsersByArea(departamentosIds),
    enabled: departamentosIds.length > 0
  });

  return (
    <Dropdown
      value={selectedUser}
      options={data}
      onChange={(e) => setSelectedUser(e.value)}
      optionLabel="username"
      placeholder="Seleccione un usuario"
      className="w-full md:w-14rem"
      loading={isLoading}
      filter
    />
  );
};

SelectUserByArea.propTypes = {
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func.isRequired
};
