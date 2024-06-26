// material-ui
import logo from '../../assets/images/auth/LogoConcesion.webp';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     *<img src={logo} alt="Mantis" width="100" />
     *
     */
    <img src={logo} alt="Consecion" width="60%" height="60%" />
  );
};

export default Logo;
