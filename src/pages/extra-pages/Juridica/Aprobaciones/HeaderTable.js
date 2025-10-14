import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from 'context/authContext';
import { useFetchPendientes } from 'lib/PQRS/fetchPendientes.js';

export const HeaderTable = ({ selectedUser, setSelectedUser }) => {
  const { user } = useAuth();
  const { fetchUsersByArea } = useFetchPendientes();
  const { data, isLoading } = useQuery({
    queryKey: ['users-area', user.departamento._id],
    queryFn: () => fetchUsersByArea(user.departamento._id)
  });

  return (
    <Dropdown
      value={selectedUser}
      options={data}
      onChange={(e) => setSelectedUser(e.value)}
      optionLabel="username"
      placeholder="Seleccione un usuario"
      className="w-72 md:w-14rem"
      loading={isLoading}
    />
  );
};

HeaderTable.propTypes = {
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func.isRequired
};
