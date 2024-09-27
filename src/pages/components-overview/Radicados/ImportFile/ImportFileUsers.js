import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import axios from 'api/axios';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
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

export const ImportFileUsers = ({ setOpen }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file.name !== 'Pqrs_usuario.xlsx') {
      setSelectedFile(null);
      setOpen(false);
      return toast.error('Estructura invalida o nombre del archivo incorrecto');
    }
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
      }
    } catch (error) {
      console.log(error);
      setError(error);
      toast.error(error.response?.data);
      setOpen(false);
      setSelectedFile(null);
    }
  };

  const uploadApi = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/radicados/readFile-users');
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
      <div className="">
        {/* <h6>Total registros a importar: {total}</h6> */}
        {error !== null && <span className="errors">{error.response.data}</span>}
      </div>
      <div className="d-flex justify-content-between">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<PersonAddAltIcon />}
          disabled={selectedFile !== null}
        >
          Cargar archivo usuarios
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

      {loading && <LinearProgress />}
    </div>
  );
};
