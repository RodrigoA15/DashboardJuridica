import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UsuariosJuridica from './UsuariosJuridica';
import { useAuth } from 'context/authContext';
import Loader from 'pages/components-overview/Loader';

function GetPendientes() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getDataPendiente();

    // const intervalId = setInterval(getDataPendiente, 5000);
    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    diasHabiles(data);
  }, [data]);

  const getDataPendiente = async () => {
    try {
      const response = await axios.get(`/radicados/depjuridica_radicados/${user.departamento}`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS Pendientes');
      } else {
        setError('Error de servidor');
      }
      setIsLoading(false);
    }
  };

  const diasHabiles = (fecha_radicado) => {
    let contador = 0;
    let fechaInicio = new Date(fecha_radicado);
    let fechaFin = new Date();
    let festivos = ['2023-10-06', '2023-10-05'];

    while (fechaInicio <= fechaFin) {
      const diaSemana = fechaInicio.getDay();
      const fechaActual = fechaInicio.toISOString().split('T')[0];
      const lunes = 1;
      const viernes = 5;

      if (diaSemana >= lunes && diaSemana <= viernes) {
        if (!festivos.includes(fechaActual)) {
          contador++;
        }
      }

      fechaInicio.setDate(fechaInicio.getDate() + 1);
    }

    console.log('Días laborables:', contador);

    return contador;
  };

  const getBackgroundColor = (fechaRadicado) => {
    const diasLaborables = diasHabiles(fechaRadicado);

    if (diasLaborables <= 5) {
      return '#748E63'; // Verde
    } else if (diasLaborables >= 6 && diasLaborables <= 9) {
      return '#FFCD4B'; // Amarillo
    } else if (diasLaborables >= 10 && diasLaborables <= 12) {
      return '#d43a00'; // Naranja
    } else if (diasLaborables >= 13) {
      return '#BB2525'; // Rojo
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Número Radicado</TableCell>
            <TableCell align="center">Fecha Radicado</TableCell>
            <TableCell align="center">Asunto</TableCell>
            <TableCell align="center">Departamento</TableCell>
            <TableCell align="center">Asignar Radicado</TableCell>
            <TableCell align="center">Dias</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <TableRow key="error">
              <TableCell colSpan={5}>{error}</TableCell>
            </TableRow>
          ) : (
            data.map((pendiente) => (
              <TableRow key={pendiente._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{
                    color: pendiente.id_asunto.nombre_asunto === 'TUTELA' ? 'black' : 'black',
                    background: getBackgroundColor(new Date(pendiente.fecha_radicado))
                  }}
                >
                  <b>{pendiente.numero_radicado}</b>
                </TableCell>
                <TableCell align="center">{new Date(pendiente.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                <TableCell align="center">{pendiente.id_asunto.nombre_asunto}</TableCell>
                <TableCell align="center">{pendiente.id_departamento.nombre_departamento}</TableCell>
                <TableCell>
                  <UsuariosJuridica pendiente={pendiente} />
                </TableCell>
                <TableCell>{diasHabiles(new Date(pendiente.fecha_radicado))}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GetPendientes;
