import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '../../../node_modules/@mui/material/index';
import axios from 'api/axios';
function EstadoDepartamento() {
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    apiDataEstados();
  }, []);

  const apiDataEstados = async () => {
    try {
      const response = await axios.get('/radicados/estadoDepartamento');
      setEstados(response.data[0]);
      console.log(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableCell>Departamento</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Cantidad</TableCell>
        </TableHead>
        <TableBody>
          {estados.map((i) => (
            <TableRow key={i._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{i.departamento}</TableCell>
              <TableCell>{i.estado}</TableCell>
              <TableCell>{i.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EstadoDepartamento;
