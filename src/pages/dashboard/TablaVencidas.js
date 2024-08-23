import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import axios from 'api/axios';
import useDiasHabiles from 'hooks/useDate';
import { classNames } from 'primereact/utils';

const TablaVencidas = () => {
  const [data, setData] = useState([]);
  const { diasHabiles } = useDiasHabiles();
  useEffect(() => {
    getPQRSexpired();
  }, []);

  const getPQRSexpired = async () => {
    try {
      const response = await axios.get('/radicados/vencidas');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const extractMonth = (fecha) => {
    const date = new Date(fecha).getMonth() + 1;
    return date;
  };

  const extractYear = (fecha) => {
    const date = new Date(fecha).getFullYear();
    return date;
  };

  const getBackgroundColor = (rowData) => {
    const diasLaborables = diasHabiles(rowData);

    const hola = classNames('rounded-pill justify-content-center align-items-center text-center font-weight-bold', {
      'dias text-dark': diasLaborables >= 10 && diasLaborables <= 12,
      'bg-danger bg-gradient text-dark': diasLaborables >= 13
    });

    return <div className={hola}>{diasLaborables}</div>;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Año</TableCell>
              <TableCell align="center">Mes</TableCell>
              <TableCell align="center">&aacute;rea</TableCell>
              <TableCell align="center">Responsable</TableCell>
              <TableCell align="center">N&uacute;mero radicado</TableCell>
              <TableCell align="center">Fecha asignaci&oacute;n</TableCell>
              <TableCell align="center">Tiempo sin respuesta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((item) => diasHabiles(item.fecha_radicado) >= 10)
              .map((item) => (
                <TableRow key={item.numero_radicado}>
                  <TableCell align="center">{extractYear(item.fecha_radicado)}</TableCell>
                  <TableCell align="center">{extractMonth(item.fecha_radicado)}</TableCell>
                  <TableCell align="center">{item.id_departamento}</TableCell>
                  <TableCell align="center">{item.id_usuario}</TableCell>
                  <TableCell align="center">{item.numero_radicado}</TableCell>
                  <TableCell align="center">{item.fecha_asignacion}</TableCell>
                  <TableCell align="center">{getBackgroundColor(item.fecha_radicado)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TablaVencidas;
