import axios from 'api/axios';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const AnswerByuser = () => {
  const [data, setData] = useState([]);
  const dia = new Date();
  const fecha1 = new Date(dia.getFullYear(), dia.getMonth(), 0);
  const fecha2 = new Date();
  const [fechaInicio, setFechaInicio] = useState(fecha1);
  const [fechaFin, setFechaFin] = useState(fecha2);

  const getAnswerByUserApi = async () => {
    try {
      const response = await axios.get(`/answer/answeruser/${fechaInicio}/${fechaFin}`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <div className="d-flex justify-content-between">
              <input className="form-control" type="date" onChange={(e) => setFechaInicio(e.target.value)} />
              <input className="form-control" type="date" onChange={(e) => setFechaFin(e.target.value)} />
              <button className="btn btn-primary" onClick={() => getAnswerByUserApi()}>
                Buscar
              </button>
            </div>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Total respuestas</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item._id}</TableCell>
                <TableCell>{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
