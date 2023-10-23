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

  const dataLimpia = () => {
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

  return (
    <div className="row">
      <div className="col mb-3">
        <JsonToExcel title="Descargar Excel" data={dataLimpia()} fileName="ReporteRadicados" />
      </div>
      <div className="col mb-3">
        <CsvDownloadButton
          data={dataLimpia()}
          filename="ReporteRadicados"
          style={{
            boxShadow: 'inset 0px 1px 0px 0px #117dbf',
            background: '#117dbf',
            backgroundColor: '#117dbf',
            display: 'inline-block',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 'bold',
            padding: '6px 24px',
            textDecoration: 'none',
            textShadow: '0px 1px 0px #9b14b3',
            height: "55px"
          }}
        >
          Descargar CSV
        </CsvDownloadButton>
      </div>
    </div>
  );
}

export default JsonToFileExcel;
