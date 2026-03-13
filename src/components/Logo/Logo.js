// material-ui
import { LazyLoadImage } from 'react-lazy-load-image-component';
import logoDashboard from '../../assets/images/auth/logoDashboard.webp';

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
   
     *
     */
    <>
      <LazyLoadImage src={logoDashboard} alt="image dashboard" width="60%" height="60%" />
    </>
  );
};

export default Logo;
