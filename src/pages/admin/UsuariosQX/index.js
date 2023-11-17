import { Grid } from '../../../../node_modules/@mui/material/index';
import TableUsers from './tableUsers';

function UsuariosQX() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <TableUsers />
      </Grid>
    </Grid>
  );
}

export default UsuariosQX;
