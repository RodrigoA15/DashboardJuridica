import React, { Fragment, useState } from 'react';
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Toaster, toast } from 'sonner';
import axios from 'api/axios';
import Updateasunto from './update';
import Button from '@mui/material/Button';

function ListaAsuntos({ row }) {
  const [open, setOpen] = useState(false);
  //Estado para el ID del asunto a actualizar
  const [asuntoId, setAsuntoId] = useState(null);
  //SwetAlert
  const MySwal = withReactContent(Swal);

  const deletedAsunto = async ({ _id }) => {
    try {
      const alert = await MySwal.fire({
        title: '¿Está seguro de eliminar el asunto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (alert.isConfirmed) {
        await axios.delete(`/asunto/asunto/${_id}`);
        toast.success('Eliminado correctamente');
      } else {
        toast.error('Cancelado');
      }
    } catch (error) {
      toast.error('error de servidor. No se pudo eliminar el asunto');
    }
  };

  return (
    <Fragment>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
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
                    <TableCell>
                      <Button variant="text">Agregar asunto</Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.asuntos.map((asunto) => (
                    <TableRow key={asunto._id}>
                      {/* Componente Actualizar Asunto */}
                      <Updateasunto asuntoId={asuntoId} setAsuntoId={setAsuntoId} asunto={asunto} />
                      <TableCell>
                        <IconButton color="warning" title="Editar" onClick={() => setAsuntoId(asunto._id)}>
                          <BorderColorIcon />
                        </IconButton>

                        <IconButton color="error" title="Eliminar" onClick={() => deletedAsunto(asunto)}>
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
