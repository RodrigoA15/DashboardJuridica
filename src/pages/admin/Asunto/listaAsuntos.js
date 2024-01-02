import React, { Fragment, useState } from 'react';
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

function ListaAsuntos({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableHead>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.nombre_departamento}</TableCell>
        </TableRow>
      </TableHead>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre Asunto</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.asuntos.map((asunto) => (
                    <TableRow key={asunto._id}>
                      <TableCell>{asunto.nombre_asunto}</TableCell>
                      <TableCell>
                        <IconButton color="warning" title="Editar">
                          <BorderColorIcon />
                        </IconButton>
                        <IconButton color="error" title="Eliminar">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default ListaAsuntos;

ListaAsuntos.propTypes = {
  row: PropTypes.object
};
