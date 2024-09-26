import MainCard from 'components/MainCard';
import { Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const Card = ({ description, value, color }) => {
  return (
    <MainCard contentSX={{ p: 2.25 }} className={`${color}`}>
      <Stack spacing={0.5}>
        <Typography style={{ margin: 'auto' }} variant="h6" color="textSecondary">
          {description}
        </Typography>
        <Grid container alignItems="center">
          <Grid item style={{ margin: 'auto' }}>
            <Typography variant="h3" color="inherit">
              {value}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
};

Card.propTypes = {
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
