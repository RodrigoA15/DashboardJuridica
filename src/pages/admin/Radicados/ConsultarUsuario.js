import axios from 'api/axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LoaderComponent from 'components/LoaderComponent';

export const ConsultarUsuario = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    radicadosUsuarioApi(data);
  });

  const radicadosUsuarioApi = async (data) => {
    try {
      setLoading(true);
      const response = await axios.get(`/radicados/search-user/${data.identificationNumber}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setData([]);
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <form onSubmit={onSubmit}>
        <InputText
          id="search"
          keyfilter="int"
          {...register('identificationNumber', {
            required: { value: true, message: 'Ingrese número de cedula' }
          })}
        />
        {errors.identificationNumber && <span className="inputForm ">{errors.identificationNumber.message}</span>}
      </form>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <LoaderComponent />
      </div>
    );
  }

  const formatFecha = (rowData) => {
    const fecha = rowData.fecha_radicado;
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };
  const header = renderHeader();

  return (
    <>
      <DataTable value={data} dataKey={'_id'} header={header} emptyMessage={error}>
        <Column field="numero_radicado" header="N&uacute;mero radicado" />
        <Column field="fecha_radicado" body={formatFecha} header="Fecha radicado" />
        <Column field="cantidad_respuesta" header="Cantidad respuesta" />
        <Column field="procedencia.nombre" header="Nombre usuario" />
        <Column field="procedencia.apellido" header="Apellido usuario" />
        <Column field="canal_entrada.nombre_canal" header="Canal de entrada" />
        <Column field="asunto.nombre_asunto" header="Asunto" />
        <Column field="tipificacion.nombre_tipificacion" header="Tipificaci&oacute;n" />
        <Column field="departamento.nombre_departamento" header="&Aacute;rea" />
        <Column field="estado_radicado" header="Estado" />
      </DataTable>
    </>
  );
};
