import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { JsonToExcel } from 'react-json-to-excel';
import CsvDownloadButton from 'react-json-to-csv';

function JsonToFileExcel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    dataRadicadosJson();
  }, []);

  const dataRadicadosJson = async () => {
    try {
      const response = await axios.get('/radicados/radicadop');
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const downloadData = () => {
    return data.map((item) => {
      return {
        numero_radicado: item.numero_radicado,
        fecha_radicado: new Date(item.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' }),
        cantidad_respuesta: item.cantidad_respuesta,
        Procedencia: item.id_procedencia.nombre,
        CanalEntrada: item.id_canal_entrada.nombre_canal,
        Asunto: item.id_asunto.nombre_asunto,
        Tipificacion: item.id_tipificacion.nombre_tipificacion,
        Entidad: item.id_entidad.nombre_entidad,
        Departamento: item.id_departamento.nombre_departamento,
        EstadoRadicado: item.estado_radicado
      };
    });
  };

  const downloadJSON = () => {
    if (data) {
      const jsonDataString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonDataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ReporteRadicados.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="row">
      <div className="col mb-3">
        <JsonToExcel title="Descargar Excel" data={downloadData()} fileName="ReporteRadicados" />
      </div>
      <div className="col mb-3">
        <CsvDownloadButton
          data={downloadData()}
          filename="ReporteRadicados"
          style={{
            background: '#ff870a',
            backgroundColor: '#117dbf',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '15px',
            padding: '6px 24px',
            textShadow: '0px 1px 0px #9b14b3',
            height: '55px',
            border: 'none'
          }}
        >
          Descargar CSV
        </CsvDownloadButton>
      </div>
      <div className="m-0 d-flex justify-content-center">
        <button
          style={{
            background: '#ff870a',
            backgroundColor: '#117dbf',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '15px',
            padding: '6px 24px',
            textShadow: '0px 1px 0px #9b14b3',
            height: '55px',
            border: 'none'
          }}
          onClick={downloadJSON}
        >
          Descargar JSON
        </button>
      </div>
    </div>
  );
}

export default JsonToFileExcel;
