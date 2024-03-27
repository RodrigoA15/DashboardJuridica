// import { Toaster } from 'sonner';
import axios from 'api/axios';
import { useState } from 'react';
function JsonToFileExcel() {
  const [archivo, setArchivo] = useState(null);

  const descargarArchivo = async () => {
    try {
      const respuesta = await axios.get('/radicados/radicadop', {
        responseType: 'blob' // Indicar que esperamos un blob como respuesta
      });

      // Crear una URL para el blob
      const url = window.URL.createObjectURL(new Blob([respuesta.data]));
      // Establecer el archivo en el estado
      setArchivo(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <div>
      <button className="btn btn-success" onClick={descargarArchivo}>
        Descargar excel
      </button>
      {/* Mostrar el archivo si está disponible */}
      {archivo && (
        <a href={archivo} download="radicados.xlsx">
          Descargar Archivo
        </a>
      )}
    </div>
  );
}

export default JsonToFileExcel;
