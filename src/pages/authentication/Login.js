// project import
import { Grid } from '@mui/material';
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';
import logoDashboard from '../../assets/images/auth/logo_login.png';
import background from '../../assets/images/auth/background_login.png';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {/* Popayan */}
        {/*<AuthLogin
          primaryColor="#5a96e3"
          secondaryColor="#457ec4"
          lightColor="#72a9ee"
          secretariaLogoUrl={logoDashboard}
          backgroundImageUrl={background}
        /> }

        {/*Envigado */}
        {/*<AuthLogin
          primaryColor="#F97316"
          secondaryColor="#983906"
          lightColor="#F7D0B8"
          secretariaLogoUrl={logoDashboard}
          backgroundImageUrl={background}
        /> */}

        {/*Atlantico */}
        {
          <AuthLogin
            primaryColor="#F3262C"
            secondaryColor="#E31E24"
            lightColor="#F7D0B8"
            secretariaLogoUrl={logoDashboard}
            backgroundImageUrl={background}
          />
        }
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
