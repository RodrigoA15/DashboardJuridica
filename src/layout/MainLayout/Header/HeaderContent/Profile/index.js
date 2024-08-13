import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, CardContent, ClickAwayListener, Grid, Paper, Popper, Stack, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { useAuth } from 'context/authContext';
// assets
import { Button } from '../../../../../../node_modules/@mui/material/index';
import LoaderComponent from 'components/LoaderComponent';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    // Lógica para el logout aquí
    logout();
    window.location.replace('http://localhost:5174/login');
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.300';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <AccountCircleIcon />
          <Typography variant="subtitle1">{user !== null ? user.username : <LoaderComponent />}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  {user !== null ? (
                    <MainCard elevation={0} border={false} content={false}>
                      <CardContent sx={{ px: 2.5, pt: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Stack direction="row" spacing={1.25} alignItems="center">
                              <Stack>
                                <Typography variant="h6">{user.username}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {user.role.nombre_rol}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Grid>
                          <Grid item>
                            <Button onClick={handleLogout}>Cerrar</Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </MainCard>
                  ) : (
                    <LoaderComponent />
                  )}
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
