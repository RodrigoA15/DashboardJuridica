import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { exportToExcel } from 'react-json-to-excel';
import { Button } from '@mui/material';
function RadicadosExcel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    dataExcel();
  }, []);

  const dataExcel = async () => {
    try {
      const response = await axios.get('/radicados/excel');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cleanData = data.map((item) => {
    return {
      'Número radicado': item.numero_radicado,
      'Fecha radicado': new Date(item.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' }),
      'Cantidad respuesta': item.cantidad_respuesta,
      Observaciones: item.observaciones_radicado,
      Procedencia: item.id_procedencia.nombre,
      'Canal entrada': item.id_canal_entrada.nombre_canal,
      Asunto: item.id_asunto.nombre_asunto,
      Tipificacion: item.id_tipificacion.nombre_tipificacion,
      Entidad: item.id_entidad.nombre_entidad === 'Movit' ? 'EMTEL' : item.id_entidad.nombre_entidad,
      Area: item.id_departamento ? item.id_departamento.nombre_departamento : 'NA',
      'Estado radicado': item.estado_radicado
    };
  });

  return (
    <>
      <Button variant="contained" size="medium" onClick={() => exportToExcel(cleanData, 'Radicados')}>
        Radicados
      </Button>
    </>
  );
}

export default RadicadosExcel;
