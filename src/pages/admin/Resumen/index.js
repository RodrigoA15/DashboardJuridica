import { useEffect, useMemo, useState } from 'react';
import MainCard from 'components/MainCard';
import { Grid, Typography } from '@mui/material';
import { BarChart } from './StatesByUser';
import { TableUsersAnswer } from './tableUsersAnswer';
import { TableAffairsAnswers } from './tableAffairAnswers';
import { DateRangeFilter } from './DateRangeFilter';
import { getCurrentMonthDateRange } from './utils/date';
import { useParameters } from 'hooks/useParameters';
import { Productivity } from './productividad/index';
import { AsignacionUsuarios } from './productividad/tables/AsignacionUsuarios';

function IndexResumen() {
  const { parameters } = useParameters();
  const [validateParam, setValidateParam] = useState(false);

  const currentMonthRange = useMemo(() => getCurrentMonthDateRange(), []);

  // Borrador: lo que el usuario edita en los inputs
  const [draftStartDate, setDraftStartDate] = useState(currentMonthRange.startDate);
  const [draftEndDate, setDraftEndDate] = useState(currentMonthRange.endDate);

  // Rango aplicado: lo que reciben las tablas (se actualiza al filtrar)
  const [appliedRange, setAppliedRange] = useState(currentMonthRange);

  useEffect(() => {
    const validatorParameter = parameters.some((parametro) => parametro.nombre_parametro === 'Tabla asuntos' && parametro.activo);
    if (validatorParameter !== validateParam) {
      setValidateParam(validatorParameter);
    }
  }, [parameters, validateParam]);

  const handleApplyDateFilter = (event) => {
    event.preventDefault();
    setAppliedRange({
      startDate: draftStartDate,
      endDate: draftEndDate
    });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={6} md={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Capacidad Jur&iacute;dica - Promedios mensuales</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Productivity />
        </MainCard>
      </Grid>

      <Grid item xs={6} md={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Capacidad Jur&iacute;dica - Usuarios</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <AsignacionUsuarios />
        </MainCard>
      </Grid>

      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="start" spacing={2}>
          <Grid item>
            <DateRangeFilter
              startDate={draftStartDate}
              endDate={draftEndDate}
              onStartDateChange={setDraftStartDate}
              onEndDateChange={setDraftEndDate}
              onSubmit={handleApplyDateFilter}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6} md={6}>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <TableAffairsAnswers startDate={appliedRange.startDate} endDate={appliedRange.endDate} />
        </MainCard>
      </Grid>

      <Grid item xs={6} md={6}>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <TableUsersAnswer startDate={appliedRange.startDate} endDate={appliedRange.endDate} />
        </MainCard>
      </Grid>

      <Grid item xs={6} md={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Total de asignaciones pendientes y respuestas por usuario</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <BarChart />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default IndexResumen;
