import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'api/axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import PDFViewer from './PDFViewer';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import IndexTypesAffairs from './ActualizarAsunto/index';
import { Parameters } from 'hooks/useParameters';
import { ListAreas } from './ActualizarArea/ListAreas';
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material';
// import ClearIcon from '@mui/icons-material/Clear';
// import CheckIcon from '@mui/icons-material/Check';
// import CreateIcon from '@mui/icons-material/Create';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function ModalRespuestas({ open, handleClose, data, asignados, setAsignados }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onChange' });
  const [valueAffair, setValueAffair] = useState(null);
  const [nameArea, setNameArea] = useState(null);
  const [granted, setGranted] = useState(null);
  const [url, setUrl] = useState('');
  const [urlFile, setUrlFile] = useState('');
  // const [newIdentififcation, setNewIdentification] = useState(null);
  // const [newName, setNewName] = useState(null);
  // const [newLastName, setNewLastName] = useState(null);
  // const [updated, setUpdated] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setUrl(URL.createObjectURL(acceptedFiles[0]));
    setUrlFile(acceptedFiles[0]);
  }, []);
  const { parameters } = Parameters();

  const parametroActivo = parameters.some((parametro) => parametro.nombre_parametro === 'Asuntos respuesta' && parametro.activo === true);
  const validorGranted = granted === 'Devuelto';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/pdf': ['.pdf']
    },
    disabled: validorGranted || parametroActivo,
    maxSize: 10000000
  });

  const MySwal = withReactContent(Swal);
  const onSubmit = handleSubmit(async (num) => {
    const alert = await MySwal.fire({
      title: 'Esta seguro de agregar respuesta?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, agregar',
      customClass: {
        container: 'swal-zindex'
      }
    });

    if (alert.isConfirmed) {
      if (!parametroActivo) {
        await crearRespuesta(num);
      }
    } else {
      toast.error('Respuesta Cancelada');
    }
    reset();
  });

  const handleSubmitOutFile = () => {
    createAnswerOutFile();
    updateAffair();
    updateArea();
    handleClose();
    setNameArea(null);
  };

  const crearRespuesta = async (num) => {
    try {
      const numero_radicado_respuesta = num.numero_radicado_respuesta;
      const formData = new FormData();
      formData.append('numero_radicado_respuesta', numero_radicado_respuesta);
      formData.append('concedido', granted);
      formData.append('id_asignacion', data._id);
      formData.append('respuesta_pdf', urlFile);
      formData.append('fechaRespuesta', new Date());
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      await axios.post('/answer', formData, config);
      toast.success('Respuesta Agregada');
      setUrl('');
      // cancelUpdateNewName();
      handleClose();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  //Funcion actualizar asunto de la peticion (Atlantico)
  const updateAffair = async () => {
    try {
      await axios.put(`/typeAffair/${data.id_radicado._id}`, {
        id_asunto: valueAffair
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const updateArea = async () => {
    try {
      await axios.put(`/answer/update-area`, {
        id_radicado: data.id_radicado._id,
        id_departamento: nameArea
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const updateState = async () => {
    try {
      await axios.put(`/radicados/reasignacion/${data.id_radicado._id}`, {
        estado_radicado: 'Devuelto',
        id_asunto: '674198216459b9e9df5473a4'
      });
      const newData = asignados.filter((item) => item._id !== data._id);
      setAsignados(newData);
      handleClose();
      setGranted(null);
      toast.success('Radicado actualizado correctamente');
    } catch (error) {
      toast.error(error.response.data);
    }
  };

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

  // const updateOrigin = async () => {
  //   try {
  //     const updatedData = {};
  //     if (newName !== null) updatedData.nombre = newName;
  //     if (newLastName !== null) updatedData.apellido = newLastName;
  //     if (newIdentififcation !== null) updatedData.numero_identificacion = newIdentififcation;

  //     // Validar si no hay datos para actualizar
  //     if (Object.keys(updatedData).length === 0) {
  //       return toast.error('No hay datos válidos para actualizar');
  //     }

  //     await axios.put(`/origin/${data.id_radicado.id_procedencia._id}`, updatedData);
  //     toast.success('Procedencia actualizada correctamente');
  //     cancelUpdateNewName();
  //   } catch (error) {
  //     toast.error(error.response?.data || 'Error al actualizar la procedencia');
  //   }
  // };

  // const cancelUpdateNewName = () => {
  //   setUpdated(false);
  //   setNewName(null);
  //   setNewLastName(null);
  //   setNewIdentification(null);
  // };

  // const activeUpdated = () => {
  //   setUpdated(true);
  // };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {data && (
            <form onSubmit={onSubmit} encType="multipart/form-data">
              {parametroActivo && (
                <div>
                  <FormControl>
                    <FormLabel id="concedido">
                      <h6>Concedido*</h6>
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="concedido"
                      name="concedido"
                      value={granted}
                      onChange={(e) => setGranted(e.target.value)}
                    >
                      <FormControlLabel value="Si" control={<Radio />} label="Si" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Devuelto" control={<Radio />} label="Devuelto" />
                    </RadioGroup>
                  </FormControl>
                </div>
              )}
              {!parametroActivo && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="NoRadicado">
                    Número radicado respuesta
                  </label>
                  <input
                    className="form-control rounded-pill"
                    type="number"
                    {...register('numero_radicado_respuesta', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio'
                      },
                      minLength: {
                        value: 12,
                        message: 'Número radicado respuesta debe ser minimo 12 carácteres'
                      }
                    })}
                  />
                  {errors.numero_radicado_respuesta && <span className="inputForm ">{errors.numero_radicado_respuesta.message}</span>}
                </div>
              )}
              {/* <div className="mb-3 row align-items-center">
                <h6>Informaci&oacute;n usuario</h6>

                <div className="col">
                  <label className="form-label" htmlFor="name">
                    N&uacute;mero identificaci&oacute;n
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    defaultValue={data.id_radicado.id_procedencia.numero_identificacion}
                    onChange={(e) => setNewIdentification(e.target.value)}
                    disabled={!updated}
                  />
                </div>

                <div className="col">
                  <label className="form-label" htmlFor="name">
                    Nombres
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={data.id_radicado.id_procedencia.nombre}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={!updated}
                  />
                </div>

                <div className="col">
                  <label className="form-label" htmlFor="lastname">
                    Apellidos
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={data.id_radicado.id_procedencia.apellido}
                    onChange={(e) => setNewLastName(e.target.value)}
                    disabled={!updated}
                  />
                </div>

                {!updated && (
                  <div className="col-1">
                    <Tooltip title="Editar" arrow>
                      <IconButton onClick={activeUpdated}>
                        <CreateIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}

                {updated && (
                  <div className="col-1">
                    <Tooltip title="Cancelar" placement="top" arrow>
                      <IconButton aria-label="cancel" color="error" onClick={cancelUpdateNewName}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Actualizar" arrow>
                      <IconButton aria-label="check" color="success" onClick={updateOrigin}>
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </div> */}
              {parametroActivo && (
                <>
                  <h6>Informaci&oacute;n radicado*</h6>

                  <div>
                    <IndexTypesAffairs
                      setValueAffair={setValueAffair}
                      granted={granted}
                      typeAffair={data.id_radicado.id_asunto.id_tipo_asunto}
                    />
                  </div>

                  <div>
                    <ListAreas setNameArea={setNameArea} granted={granted} />
                  </div>
                </>
              )}

              {!parametroActivo && (
                <div>
                  <div
                    className="mb-3"
                    {...getRootProps()}
                    style={{
                      background: '#e3e3e3',
                      padding: '20px'
                    }}
                  >
                    <label className="form-label" htmlFor="NoRadicado">
                      Archivo
                    </label>
                    <input className="form-control rounded-pill" {...getInputProps()} />
                    {isDragActive ? (
                      <p>Suelte el archivo aqui...</p>
                    ) : (
                      <div>
                        <p>Arrastre y suelte archivo PDF aquí o haga clic para selecciona archivo</p>
                        <p className="errors">Nota: el tamaño del archivo debe ser inferior a 10 MB</p>
                      </div>
                    )}
                  </div>
                  {url && <PDFViewer url={url} />}

                  {urlFile && !validorGranted ? (
                    <Button className="btn btn-success mt-4" type="submit">
                      Responder
                    </Button>
                  ) : (
                    <span className="inputForm">Todos los campos son abligatorios</span>
                  )}
                </div>
              )}

              {validorGranted && (
                <Button className="btn btn-success mt-4" onClick={() => updateState()}>
                  Devolver
                </Button>
              )}

              {parametroActivo &&
                (!nameArea || !valueAffair || !granted ? (
                  <p className="errors">Seleccione todos los campos</p>
                ) : (
                  <Button disabled={validorGranted} className="btn btn-success mt-4" onClick={() => handleSubmitOutFile()}>
                    Responder
                  </Button>
                ))}
            </form>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ModalRespuestas;

ModalRespuestas.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object,
  handleClose: PropTypes.func,
  asignados: PropTypes.array,
  setAsignados: PropTypes.func
};
