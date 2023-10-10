import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'api/axios';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'sonner';

function Preasignaciones() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPreasignaciones();

    const intervalId = setInterval(getAllPreasignaciones, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getAllPreasignaciones = async () => {
    try {
      const response = await axios.get('/preasignados');
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No tienes PQRS preasignadas');
      } else {
        setError('Error de servidor');
      }
      setIsLoading(false);
    }
  };

  const updateStatePreasignacion = async (pre) => {
    const MySwal = withReactContent(Swal);

    const alert = await MySwal.fire({
      title: '¿Está seguro de aceptar esta petición?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar'
    });

    if (alert.isConfirmed) {
      try {
        // Realiza la actualización solo para el elemento pre seleccionado
        await axios.put(`/radicados/radicados/${pre._id}`, {
          estado_radicado: 'Pendiente'
        });
        // Actualiza el estado solo para el elemento pre seleccionado

        setData((prevData) => prevData.map((item) => (item._id === pre._id ? { ...item, estado_radicado: 'Pendiente' } : item)));

        toast.success('Petición aceptada correctamente');
      } catch (error) {
        console.error('Error al actualizar el estado de la petición:', error);
        toast.error('Error al aceptar la petición');
      }
    } else {
      toast.error('No se aceptó la petición');
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors expand={true} offset="80px" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número Radicado</TableCell>
              <TableCell align="left">Fecha Radicado</TableCell>
              <TableCell align="left">Asunto</TableCell>
              <TableCell align="left">Departamento</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow key="loading">
                <TableCell colSpan={5}>Cargando...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow key="error">
                <TableCell colSpan={5}>{error}</TableCell>
              </TableRow>
            ) : (
              data.map((pre) => (
                <TableRow key={pre._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {pre.numero_radicado}
                  </TableCell>
                  <TableCell align="left">{new Date(pre.fecha_radicado).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                  <TableCell align="left">{pre.id_asunto.nombre_asunto}</TableCell>
                  <TableCell align="left">{pre.id_departamento.nombre_departamento}</TableCell>

                  <TableCell align="center">
                    <Button color="success" startIcon={<DoneIcon />} onClick={() => updateStatePreasignacion(pre)}>
                      Aceptar
                    </Button>
                    <Button color="error" startIcon={<CloseIcon />}>
                      Rechazar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Preasignaciones;
