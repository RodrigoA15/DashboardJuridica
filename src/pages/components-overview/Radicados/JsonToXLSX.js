import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import CsvDownloadButton from 'react-json-to-csv';
import ExportFromJson from 'export-from-json';

function JsonToFileExcel() {
  const [data, setData] = useState([]);
  const fileName = 'ReporteRadicados';
  const exportType = ExportFromJson.types.xls;

  useEffect(() => {
    dataRadicadosJson();
  }, []);

  const dataRadicadosJson = async () => {
    try {
      const response = await axios.get('/radicados_respuestas_excel');
      setData(response.data);
      console.log(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const downloadData = () => {
    return data.map((item) => {
      return {
        numero_radicado: item.id_asignacion.id_radicado.numero_radicado,
        fecha_radicado: new Date(item.id_asignacion.id_radicado.fecha_radicado).toLocaleDateString('es-CO', { timeZone: 'UTC' }),
        cantidad_respuesta: item.id_asignacion.id_radicado.cantidad_respuesta,
        Procedencia: item.id_asignacion.id_radicado.id_procedencia.nombre,
        CanalEntrada: item.id_asignacion.id_radicado.id_canal_entrada.nombre_canal,
        Asunto: item.id_asignacion.id_radicado.id_asunto.nombre_asunto,
        Tipificacion: item.id_asignacion.id_radicado.id_tipificacion.nombre_tipificacion,
        Entidad: item.id_asignacion.id_radicado.id_entidad.nombre_entidad,
        Departamento: item.id_asignacion.id_radicado.id_departamento.nombre_departamento,
        EstadoRadicado: item.id_asignacion.id_radicado.estado_radicado,
        UsuarioEncargado: item.id_asignacion.id_usuario.username,
        NumeroRespuestaRadicado: item.numero_radicado_respuesta,
        FechaRespuesta: new Date(item.fechaRespuesta).toLocaleDateString('es-CO', { timeZone: 'UTC' })
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

  const fileExcel = async () => {
    ExportFromJson({
      data: downloadData(),
      fileName,
      exportType
    });
  };

  return (
    <div className="row">
      <div className="col mb-3">
        <button onClick={fileExcel}>Descargar</button>
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
