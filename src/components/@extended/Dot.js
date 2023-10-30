import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Dot = ({ color, size }) => {
  const theme = useTheme();
  let main;
  switch (color) {
    case 'secondary':
      main = '';
      break;
    case 'error':
      main = '#D95964';
      break;
    case 'warning':
      main = '#FFEE58';
      break;
    case 'info':
      main = '#F29F05';
      break;
    case 'success':
      main = '#2BBF26';
      break;
    case 'primary':
    default:
      main = theme.palette.primary.main;
  }

  return (
    <Box
      sx={{
        width: size || 8,
        height: size || 8,
        borderRadius: '50%',
        bgcolor: main
      }}
    />
  );
};

Dot.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

export default Dot;
