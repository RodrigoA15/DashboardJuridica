import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import CsvDownloadButton from 'react-json-to-csv';
import ExportFromJson from 'export-from-json';
import { toast } from 'sonner';
import { Toaster } from '../../../../node_modules/sonner/dist/index';

function JsonToFileExcel() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const fileName = 'ReporteRadicadosRespuesta';
  const exportType = ExportFromJson.types.xls;

  useEffect(() => {
    dataRadicadosJson();
    allDataRadicados();
  }, []);
  //DataExcel todos los radicados
  const allDataRadicados = async () => {
    try {
      const dataRadicados = await axios.get(`/radicados/radicadop`);
      setAllData(dataRadicados.data);
    } catch (error) {
      toast.error('No se pudo cargar informacion radicados.xlsx');
    }
  };

  //DataExcel Radicados con respuesta
  const dataRadicadosJson = async () => {
    try {
      const response = await axios.get('/radicados_respuestas_excel');
      setData(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };
  //Data todos los Radicados
  const downloadAllData = () => {
    return allData.map((data) => {
      return {
        Numero_radicado: data.numero_radicado,
        Fecha_radicado: new Date(data.fecha_radicado).toLocaleDateString('es-CO'),
        Cantidad_respuesta: data.cantidad_respuesta,
        Procedencia: data.id_procedencia.nombre,
        CanalEntrada: data.id_canal_entrada.nombre_canal,
        Asunto: data.id_asunto.nombre_asunto,
        Tipificacion: data.id_tipificacion.nombre_tipificacion,
        Entidad: data.id_entidad.nombre_entidad,
        AreaEncargada: data.id_departamento.nombre_departamento,
        Estado_radicado: data.estado_radicado
      };
    });
  };

  const fileExcelAllRadicados = async () => {
    ExportFromJson({
      data: downloadAllData(),
      fileName: 'Radicados',
      exportType
    });
  };

  //Data radicados con respuesta>>>>>>>>
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
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <div className="col mb-3">
        <button className="btn btn-success" onClick={fileExcel}>
          Excel Respuesta
        </button>
      </div>
      <div className="col mb-3">
        <CsvDownloadButton className="btn btn-primary" data={downloadData()} filename="ReporteRadicados">
          Descargar CSV
        </CsvDownloadButton>
      </div>
      <div className="col">
        <button className="btn btn-warning" onClick={downloadJSON}>
          Descargar JSON
        </button>
      </div>

      <div className="col">
        <button className="btn btn-success" onClick={fileExcelAllRadicados}>
          Excel Radicados
        </button>
      </div>
    </div>
  );
}

export default JsonToFileExcel;
