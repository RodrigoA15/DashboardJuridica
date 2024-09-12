import axios from 'api/axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const ConsultarUsuario = () => {
  const [data, setData] = useState([]);

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
      const response = await axios.get(`/radicados/search-user/${data.identificationNumber}`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderHeader = () => {
    return (
      <form onSubmit={onSubmit}>
        <FloatLabel>
          <InputText
            id="search"
            keyfilter="int"
            {...register('identificationNumber', {
              required: { value: true, message: 'Ingrese número de cedula' }
            })}
          />
          <label htmlFor="search">N&uacute;mero identificaci&oacute;n</label>
        </FloatLabel>
        {errors.identificationNumber && <span className="inputForm ">{errors.identificationNumber.message}</span>}
      </form>
    );
  };

  const formatFecha = (rowData) => {
    const fecha = rowData.fecha_radicado;
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };
  const header = renderHeader();

  return (
    <div>
      <DataTable value={data} dataKey={'_id'} header={header} emptyMessage="No se encontraron resultados">
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
    </div>
  );
};
