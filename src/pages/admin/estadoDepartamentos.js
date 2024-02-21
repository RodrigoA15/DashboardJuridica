import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '../../../node_modules/@mui/material/index';
import axios from 'api/axios';
function EstadoDepartamento() {
  const [estados, setEstados] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    apiDataEstados();
  }, []);

  const apiDataEstados = async () => {
    try {
      const response = await axios.get('/radicados/estadoDepartamento');
      setEstados(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = estados.filter((area) => area.departamento.includes(filtro));

  return (
    <TableContainer>
      <div className="row m-1 mb-3">
        <select className="form-select" onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Seleccione área</option>
          <option value="Archivo">Archivo</option>
          <option value="Detección electrónica infractores">DEI</option>
          <option value="Juridica">Juridica</option>
          <option value="Registro municipal de infractores">RMI</option>
          <option value="Front office">Front office</option>
        </select>
      </div>
      <Table>
        <TableHead>
          <TableCell>Área</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Cantidad</TableCell>
        </TableHead>
        <TableBody>
          {filterData.map((i) => (
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
