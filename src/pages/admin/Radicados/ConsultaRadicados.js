import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
// import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'api/axios';
import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from 'context/authContext';
import ModalAdmin from './modalAdmin';
import { ConsultarAsignacion } from './ConsultarAsignacion';
function ConsultaRadicados() {
  const [radicado, setRadicado] = useState([]);
  const [dataApi, setDataApi] = useState([]);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false); //Estado modal Admin
  const [visibleAS, setVisibleAS] = useState(false); //Estado modal Ver asignaciones
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState('');
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    apiDataRadicados(data);
  });
  const apiDataRadicados = async (data) => {
    try {
      const response = await axios.get(`/radicados/search/${data.numero_radicado}`);
      setRadicado(response.data);
    } catch (error) {
      setRadicado([]);
      setError(error.response.data);
    }
  };

  const queryAssigned = async (data) => {
    try {
      setLoader(true);
      const response = await axios.get(`/assigned/search/${data.numero_radicado}`);
      setDataApi(response.data);
      setLoader(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleOPenButtonAdmin = (rowData) => {
    setVisible(true);
    setData(rowData);
  };

  const handleOPenButtonAss = (rowData) => {
    setVisibleAS(true);
    queryAssigned(rowData);
  };

  const renderHeader = () => {
    return (
      <form onSubmit={onSubmit}>
        <FloatLabel>
          <InputText
            id="search"
            keyfilter="int"
            {...register('numero_radicado', {
              required: { value: true, message: 'Ingrese número de radicado' },
              minLength: {
                value: 14,
                message: 'Número Radicado debe ser mayor igual a 14 caracteres'
              }
            })}
          />
          <label htmlFor="search">Número radicado</label>
        </FloatLabel>
        {errors.numero_radicado && <span className="inputForm ">{errors.numero_radicado.message}</span>}
      </form>
    );
  };

  const buttonsGroup = (rowData) => {
    return (
      <div>
        <ButtonGroup aria-label="Basic button group">
          <Tooltip title="Consultar asignaci&oacute;n" placement="top-start">
            <IconButton
              aria-label="consulta"
              onClick={() => handleOPenButtonAss(rowData)}
              disabled={rowData.estado_radicado !== 'Asignados' && rowData.estado_radicado !== 'Respuesta'}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          {user.role.nombre_rol === 'admin' || user.role.nombre_rol === 'Radicador' ? (
            <>
              <Tooltip title="Editar radicado" placement="top-start">
                <IconButton aria-label="edit" color="warning" onClick={() => handleOPenButtonAdmin(rowData)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar radicado" placement="top-start">
                <IconButton aria-label="delete" color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <p> </p>
          )}
        </ButtonGroup>
      </div>
    );
  };

  const formatFecha = (rowData) => {
    const fecha = rowData.fecha_radicado;
    return new Date(fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  const header = renderHeader();
  return (
    <div>
      <DataTable value={radicado} dataKey={'_id'} header={header} emptyMessage={error}>
        <Column field="numero_radicado" header="Número radicado" />
        <Column field="fecha_radicado" body={formatFecha} header="Fecha radicado" />
        <Column field="cantidad_respuesta" header="Cantidad respuesta" />
        <Column field="observaciones_radicado" header="Observaciones" />
        <Column field="id_procedencia.nombre" header="Procedencia" />
        <Column field="id_canal_entrada.nombre_canal" header="Canal de entrada" />
        <Column field="id_asunto.nombre_asunto" header="Asunto" />
        <Column field="id_tipificacion.nombre_tipificacion" header="Tipificacion" />
        <Column field="id_entidad.nombre_entidad" header="Entidad" />
        <Column field="id_departamento.nombre_departamento" header="Área" />
        <Column field="estado_radicado" header="Estado" />
        <Column header="Acciones" body={buttonsGroup} />
      </DataTable>
      <ModalAdmin visible={visible} setVisible={setVisible} data={data} />
      <ConsultarAsignacion visibleAS={visibleAS} setVisibleAS={setVisibleAS} dataApi={dataApi} loader={loader} />
    </div>
  );
}

export default ConsultaRadicados;
