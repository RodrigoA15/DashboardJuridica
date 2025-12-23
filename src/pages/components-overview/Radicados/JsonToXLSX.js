// import { Toaster } from 'sonner';
import axios from 'api/axios';
import { ModalReport } from 'pages/admin/Reportes/ModalReport';
import { useState } from 'react';
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

  // Clases base para el botón: minimalista, moderno, transición y focus.
  const baseButtonClasses =
    'w-full py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 whitespace-nowrap flex items-center justify-center';

  // CLASES ESPECÍFICAS PARA CADA BOTÓN

  // 1. Botón Primario (Verde)
  const primaryActiveClasses = 'bg-[#289535] text-white hover:bg-green-700 focus:ring-green-400';

  // 3. Botón de Descarga (Gris)
  const downloadButtonClasses = 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400';

  // Clases para el botón deshabilitado (Común a todos)
  const disabledButtonClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none';

  // Función para construir las clases del botón, aceptando un color activo
  const getButtonClasses = (isDisabled, activeColorClasses) =>
    `${baseButtonClasses} ${isDisabled ? disabledButtonClasses : activeColorClasses}`;

  // Se asume que 'descargarArchivo' recibe un identificador o maneja la lógica internamente
  const isDisabled = downloaded || error || loading;

  return (
    <div className="w-full md:ml-4 flex flex-wrap items-center gap-4">
      {/* 1. Botón "Generar archivo" (Verde) */}
      <div className="flex-1 min-w-[200px] max-w-xs">
        <button
          className={getButtonClasses(isDisabled, primaryActiveClasses)}
          onClick={() => descargarArchivo('archivo')}
          disabled={isDisabled}
        >
          <span className="mr-2" role="img" aria-label="reporte-emoji">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-file-description"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
              <path d="M9 17h6" />
              <path d="M9 13h6" />
            </svg>
          </span>
          {loading ? 'Generando archivo...' : 'Generar archivo'}
        </button>
      </div>

      {/* 2. Botón "Generar reporte" (Rojo con Emoji) */}
      <div className="flex-1 min-w-[200px] max-w-xs">
        <ModalReport />
      </div>

      {/* 3. Botón de Descarga (Gris, solo si hay archivo) */}
      {archivo && (
        <div className="flex-1 min-w-[200px] max-w-xs">
          <a href={archivo} download="radicados.xlsx" className="block no-underline">
            <button className={`${baseButtonClasses} ${downloadButtonClasses}`}>Descargar archivo</button>
          </a>
        </div>
      )}

      {/* 4. Mensaje de Error */}
      {error && (
        <div className="flex-grow">
          <span className="text-red-600 font-medium ml-1">{error}</span>
        </div>
      )}
    </div>
  );
}

export default JsonToFileExcel;
