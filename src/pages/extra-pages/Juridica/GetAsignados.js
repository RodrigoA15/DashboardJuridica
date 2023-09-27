import axios from 'api/axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '../../../../node_modules/@mui/material/index';
import { useEffect, useState } from 'react';

function GetAsignados() {
  const [asignados, setAsignados] = useState([]);

  useEffect(() => {
    apiAsignados();
  }, []);

  const apiAsignados = async () => {
    try {
      const response = await axios.get('/asignaciones');
      setAsignados(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell align="left">Fecha Asignacion</TableCell>
              <TableCell align="left">Responsable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asignados.map((i) => (
              <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {i.id_radicado.estado_radicado}
                </TableCell>
                <TableCell align="left">{new Date(i.fecha_asignacion).toLocaleDateString()}</TableCell>
                <TableCell>{i.id_usuario.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GetAsignados;
