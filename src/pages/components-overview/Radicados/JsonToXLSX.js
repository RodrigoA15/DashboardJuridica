// import { Toaster } from 'sonner';
import axios from 'api/axios';
import { useState } from 'react';
import { Button, Box, Grid } from '@mui/material';
function JsonToFileExcel() {
  const [archivo, setArchivo] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const descargarArchivo = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('/radicados/radicadop', {
        responseType: 'blob' // Indicar que esperamos un blob como respuesta
      });
      const url = window.URL.createObjectURL(new Blob([respuesta.data]));
      setArchivo(url);
      setDownloaded(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Hubo un problema al descargar el archivo', error.message);
    }
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            className="bg-green-700 hover:bg-green-800"
            variant="contained"
            onClick={descargarArchivo}
            disabled={downloaded || error || loading}
          >
            {loading ? 'Generando archivo...' : 'Generar archivo'}
          </Button>
        </Grid>
        {error && <span className="m-1 errors">{error}</span>}
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
    </Box>
  );
}

export default JsonToFileExcel;
