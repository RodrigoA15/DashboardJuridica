import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material';
import Button from '@mui/material/Button';
import { toast } from 'sonner';
import axios from 'api/axios';
import IndexTypesAffairs from '../ActualizarAsunto/index';
import { ListAreas } from '../ActualizarArea/ListAreas';
import { FormUpdateUser } from './FormUpdateUser';

export const FormWithParameter = ({ data, asignados, setAsignados, handleClose }) => {
  const [valueAffair, setValueAffair] = useState(null);
  const [nameArea, setNameArea] = useState(null);
  const [granted, setGranted] = useState(null);

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

  return (
    <>
      <div>
        <FormControl>
          <FormLabel id="concedido">
            <h6>Concedido*</h6>
          </FormLabel>
          <RadioGroup row aria-labelledby="concedido" name="concedido" value={granted} onChange={(e) => setGranted(e.target.value)}>
            <FormControlLabel value="Si" control={<Radio />} label="Si" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="Devuelto" control={<Radio />} label="Devuelto" />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <FormUpdateUser data={data} />
      </div>
      <div>
        <h6>Informaci&oacute;n radicado*</h6>
        <div>
          <IndexTypesAffairs setValueAffair={setValueAffair} granted={granted} typeAffair={data.id_tipo_asunto} />
        </div>

        <div>
          <ListAreas setNameArea={setNameArea} granted={granted} />
        </div>
      </div>
      <div>
        {!nameArea || !valueAffair || !granted ? (
          <p className="errors">Seleccione todos los campos</p>
        ) : (
          <Button disabled={validorGranted} className="btn btn-success mt-4" onClick={() => handleSubmitOutFile()}>
            Responder
          </Button>
        )}
      </div>

      {validorGranted && (
        <Button className="btn btn-success mt-4" onClick={() => updateState()}>
          Devolver
        </Button>
      )}
    </>
  );
};

FormWithParameter.propTypes = {
  data: PropTypes.object,
  asignados: PropTypes.array.isRequired,
  setAsignados: PropTypes.func.isRequired,
  handleClose: PropTypes.func
};
