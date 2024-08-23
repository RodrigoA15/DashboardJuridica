import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TablePQRS = ({ response }) => {
  return (
    <>
      <TableContainer className="mb-3" component={Paper} size="small">
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead className="bg-body-secondary">
            <TableRow>
              <TableCell>PQRS</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response
              .filter((tutela) => tutela.tipo_asunto === 'PQRS')
              .map((item) =>
                item.asuntos.map((item2) => (
                  <TableRow key={item2.nombre_asunto} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover={true}>
                    <TableCell>{item2.nombre_asunto}</TableCell>
                    <TableCell>{item2.total}</TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TablePQRS;

TablePQRS.propTypes = {
  response: PropTypes.array
};
