import { useState } from 'react';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useMutation } from '@tanstack/react-query';
import { MultiSelect } from 'primereact/multiselect';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; //Modal
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material';
import axios from 'api/axios';
import { useAuth } from 'context/authContext';
import { useFetchAprobations } from 'lib/PQRS/fetchAprobations';
import { FormUpdateUser } from './FormUpdateUser';
import { ApiAreas } from '../ActualizarArea/ApiAreas';
import { ListAreas } from '../ActualizarArea/ListAreas';
import IndexTypesAffairs from '../ActualizarAsunto/index';
import { usePermissions } from 'hooks/usePermissions';

const STATUS_SEND_APROBATION = 'Pendiente aprobacion';

export const FormWithParameter = ({ data, asignados, setAsignados, handleClose }) => {
  const { user } = useAuth();
  const { canViewCreateAprobations } = usePermissions(user);
  const [valueAffair, setValueAffair] = useState(null);
  const [nameArea, setNameArea] = useState(null);
  const [granted, setGranted] = useState(null);
  const [selectedArea, setSelectedArea] = useState([]);
  const { areas } = ApiAreas();
  const { fetchCreateAprobation } = useFetchAprobations();
  const mutationCreate = useMutation({
    mutationFn: (dataAprobation) => fetchCreateAprobation(dataAprobation),
    onSuccess: () => {
      toast.success('Aprobación creada correctamente');
      setSelectedArea([]);
    }
  });

  const validorGranted = granted === 'Devuelto';
  const createAnswerOutFile = async () => {
    try {
      await axios.post(`/answer/out-file`, {
        id_asignacion: data._id,
        fechaRespuesta: new Date(),
        concedido: granted
      });

      toast.success('Archivo creado correctamente');
    } catch (error) {
      toast.error('Error al responder radicado');
    }
  };

  //Funcion actualizar asunto de la peticion (Atlantico)
  const updateAffair = async () => {
    try {
      await axios.put(`/typeAffair/${data.id_radicado}`, {
        id_asunto: valueAffair
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const updateArea = async () => {
    try {
      await axios.put(`/answer/update-area`, {
        id_radicado: data.id_radicado,
        id_departamento: nameArea
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const handleSubmitOutFile = () => {
    createAnswerOutFile();
    updateAffair();
    updateArea();
    handleClose();
    setNameArea(null);
  };

  const accept = () => {
    mutationCreate.mutate(sendDataCreateAprobation);
  };

  const reject = () => {
    toast.error('Aprobación cancelada');
  };

  const confirm = () => {
    confirmDialog({
      message: '¿Está seguro de realizar la aprobación?',
      header: 'Confirmar aprobación',
      icon: <WarningIcon className="text-red-500" />,
      acceptLabel: 'Sí',
      acceptClassName: 'px-4 ml-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600',
      rejectClassName: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600',
      rejectLabel: 'No',
      accept,
      reject
    });
  };

  const updateState = async () => {
    try {
      await axios.put(`/radicados/reasignacion/${data.id_radicado}`, {
        estado_radicado: 'Devuelto',
        id_asunto: '674198216459b9e9df5473a4'
      });
      const newData = asignados.filter((item) => item.id_radicado !== data.radicado);
      setAsignados(newData);
      handleClose();
      setGranted(null);
      toast.success('Radicado actualizado correctamente');
    } catch (error) {
      console.error(error);
      toast.error(error.response.data);
    }
  };

  const sendDataCreateAprobation = selectedArea.map((item) => {
    return {
      id_radicado: data?.id_radicado,
      id_departamento: item._id,
      estado_aprobacion: STATUS_SEND_APROBATION,
      usuario_envia: user._id
    };
  });

  return (
    <>
      <ConfirmDialog />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-4">
        {/* COLUMNA 1: Ocupa 1/3 del espacio */}
        <FormControl className="md:col-span-1">
          <FormLabel id="concedido" className="font-semibold text-gray-800 mb-2">
            Concedido*
          </FormLabel>
          <RadioGroup row aria-labelledby="concedido" name="concedido" value={granted} onChange={(e) => setGranted(e.target.value)}>
            <FormControlLabel value="Si" control={<Radio size="small" />} label="Si" />
            <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
            <FormControlLabel value="Devuelto" control={<Radio size="small" />} label="Devuelto" />
          </RadioGroup>
        </FormControl>

        {/* COLUMNA 2: Ocupa 2/3 del espacio */}
        {canViewCreateAprobations && (
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Encabezado de la sección */}
            <div className="flex items-center gap-3">
              <label htmlFor="aprobations" className="text-sm font-semibold text-gray-800">
                Aprobacion PQRS
              </label>
              <Tooltip
                title={
                  <div>
                    <p className="font-semibold">&Aacute;reas seleccionadas: {selectedArea.length}</p>
                    <ul>
                      {selectedArea.map((item) => (
                        <li key={item._id} className="list-disc ml-4">
                          {item.nombre_departamento}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                placement="top"
              >
                <VisibilityIcon className="text-gray-500 cursor-pointer" />
              </Tooltip>
            </div>

            {/* Componente MultiSelect */}
            <MultiSelect
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.value)}
              options={areas}
              optionLabel="nombre_departamento"
              display="chip"
              placeholder="Seleccione area(s)"
              maxSelectedLabels={3}
              className="w-full" // Ocupa todo el ancho de su columna
            />

            {/* Botón de acción alineado a la derecha */}
            <Button
              variant="contained"
              disabled={selectedArea.length === 0}
              sx={{
                bgcolor: '#2563eb', // bg-blue-600
                '&:hover': { bgcolor: '#1d4ed8' }, // hover:bg-blue-700
                alignSelf: 'flex-start'
              }}
              onClick={() => confirm()}
            >
              Enviar
            </Button>
          </div>
        )}
      </div>
      <div>
        <FormUpdateUser data={data} />
      </div>
      <h6 className="text-sm font-semibold mb-4">Informaci&oacute;n radicado*</h6>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        <div>
          <IndexTypesAffairs
            valueAffair={valueAffair}
            setValueAffair={setValueAffair}
            granted={granted}
            typeAffair={data?.id_tipo_asunto}
          />
        </div>

        <div>
          <ListAreas nameArea={nameArea} setNameArea={setNameArea} granted={granted} />
        </div>
      </div>
      <div className="flex justify-center">
        {!nameArea || !valueAffair || !granted ? (
          <p className="errors">Seleccione todos los campos</p>
        ) : (
          <Button
            variant="contained"
            disabled={validorGranted}
            className="bg-green-700 hover:bg-green-800 mt-4"
            onClick={() => handleSubmitOutFile()}
          >
            Responder
          </Button>
        )}
      </div>
      <div className="flex justify-center">
        {validorGranted && (
          <Button variant="contained" className="bg-green-700 mt-4 hover:bg-green-800" onClick={() => updateState()}>
            Devolver
          </Button>
        )}
      </div>
    </>
  );
};

FormWithParameter.propTypes = {
  data: PropTypes.object,
  asignados: PropTypes.array.isRequired,
  setAsignados: PropTypes.func.isRequired,
  handleClose: PropTypes.func
};
