import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { useQuery } from '@tanstack/react-query';
import { useFetchUsers } from 'lib/users/fetchUsers';
import ModalUsuarios from './modalUsuarios';
function TableUsers() {
  const { fetchGetUsers } = useFetchUsers();
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['usersQX'],
    queryFn: fetchGetUsers
  });

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpenModal(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 rounded-xl border border-gray-200 bg-white p-6">
      <DataTable
        value={data}
        stripedRows
        removableSort
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage={'No se encontraron radicados'}
        loading={isLoading}
      >
        <Column field="username" header="Nombre usuario" />
        <Column field="email" header="correo" />
        <Column field="area" header="Área" />
        <Column field="role" header="Rol" />
        <Column field="ciudad" header="Ciudad" />
        <Column field="sede.nombre_sede" header="Sede" />
        <Column
          field="sede.activo"
          header="Sede activa"
          body={(rowData) => <Badge value={rowData.sede.activo} className={rowData.sede.activo === 'S' ? 'bg-green-600' : 'bg-red-600'} />}
        />
        <Column
          field="activo"
          header="Activo"
          body={(rowData) => <Badge value={rowData.activo} className={rowData.activo === 'S' ? 'bg-green-600' : 'bg-red-600'} />}
        />

        <Column
          header="Acciones"
          body={(rowData) => (
            <button
              className="w-full sm:w-auto bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => handleOpen(rowData)}
            >
              Editar
            </button>
          )}
        />
      </DataTable>
      <ModalUsuarios open={openModal} handleClose={handleClose} data={selectedData} />
    </div>
  );
}

export default TableUsers;
