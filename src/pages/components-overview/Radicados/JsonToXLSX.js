// import { Toaster } from 'sonner';
import axios from 'api/axios';
import { useState } from 'react';
import { Button, Box, Grid } from '@mui/material';
import { useAuth } from 'context/authContext';
function JsonToFileExcel() {
  const [archivo, setArchivo] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const { user } = useAuth();

  const descargarArchivo = async () => {
    try {
      const respuesta = await axios.get('/radicados/radicadop', {
        responseType: 'blob' // Indicar que esperamos un blob como respuesta
      });
      const url = window.URL.createObjectURL(new Blob([respuesta.data]));
      setArchivo(url);
      setDownloaded(true);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      {user.role.nombre_rol === 'admin' && (
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth className="bg-success" variant="contained" onClick={descargarArchivo} disabled={downloaded}>
              Generar archivo
            </Button>
          </Grid>

          {archivo && (
            <Grid item xs={12} sm={6} md={3}>
              <a href={archivo} download="radicados.xlsx" style={{ textDecoration: 'none' }}>
                <Button fullWidth variant="contained">
                  Descargar archivo
                </Button>
              </a>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default JsonToFileExcel;
