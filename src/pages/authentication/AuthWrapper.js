import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => <Box>{children}</Box>;

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
