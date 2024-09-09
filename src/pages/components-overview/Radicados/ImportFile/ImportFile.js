import axios from 'api/axios';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import { toast } from 'sonner';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const ImportFile = ({ setOpen }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para la barra de carga
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Validar el archivo en el momento de la selección
    if (file.name !== 'Pqrs_Atlantico.xlsx') {
      setSelectedFile(null);
      setOpen(false);
      return toast.error('Estructura invalida o nombre del archivo incorrecto');
    }
    // Si pasa la validación, se guarda el archivo seleccionado
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('PQRSFILE', selectedFile);
      const response = await axios.post('/radicados/import-file', formData);
      if (response.data) {
        setUpload(true);
        toast.success('Archivo guardado');
        countRows();
      }
    } catch (error) {
      setError(error);
      toast.error(error.response?.data);
      setOpen(false);
      setSelectedFile(null);
    }
  };

  const countRows = async () => {
    try {
      const response = await axios.get('/radicados/countRows');
      setTotal(response.data);
    } catch (error) {
      setError(error);
      toast.error(error.response?.data);
      setOpen(false);
    }
  };

  const uploadApi = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/radicados/readFile');
      if (response.data) {
        toast.success('Archivo importado correctamente');
        setOpen(false);
      }
    } catch (error) {
      setError(error);
      toast.error(error.response?.data);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="mb-3">
        <h6>Total registros a importar: {total}</h6>
        {error !== null && <span className="errors">{error.response.data}</span>}
      </div>
      <div className="d-flex justify-content-between">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          disabled={selectedFile !== null}
        >
          Cargar archivo
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".xlsx" />
        </Button>
        {selectedFile !== null && (
          <div>
            <Button variant="contained" className="btn btn-success" onClick={handleUpload} disabled={upload}>
              Subir
            </Button>
          </div>
        )}
        {upload && (
          <>
            <Button variant="contained" onClick={uploadApi}>
              Importar archivo
            </Button>
          </>
        )}
      </div>
      {loading && <LinearProgress />} {/* Barra de carga */}
    </div>
  );
};

export default ImportFile;
