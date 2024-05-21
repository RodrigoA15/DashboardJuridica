import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import axios from 'api/axios';
function EstadoDepartamento() {
  const [estados, setEstados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const areas = [
    { area: 'Archivo' },
    { area: 'Detección electrónica infractores' },
    { area: 'Juridica' },
    { area: 'Registro municipal de infractores' },
    { area: 'Front office' },
    { area: 'Secretaria' }
  ];

  useEffect(() => {
    apiDataEstados();
  }, []);

  const apiDataEstados = async () => {
    try {
      const response = await axios.get('/radicados/estadoDepartamento');
      setEstados(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = estados.filter((area) => area.departamento === filtro.area);
  const renderHeader = () => {
    return (
      <div className="card flex justify-content-center">
        <Dropdown value={filtro} onChange={(e) => setFiltro(e.value)} options={areas} optionLabel="area" placeholder="Seleccione un área" />
      </div>
    );
  };

  const header = renderHeader();

  return (
    <DataTable value={filterData} dataKey="index" header={header} emptyMessage="No se encontraron resultados">
      <Column field="departamento" header="Área" />
      <Column field="estado" header="Estado" />
      <Column field="count" header="Cantidad" />
    </DataTable>
  );
}

export default EstadoDepartamento;
