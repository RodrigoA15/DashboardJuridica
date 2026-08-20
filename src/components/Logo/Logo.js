// material-ui
import { LazyLoadImage } from 'react-lazy-load-image-component';
import logoDashboard from '../../assets/images/auth/logo_login.webp';

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
      <div className="flex flex-col items-center">
        <LazyLoadImage src={logoDashboard} alt="image dashboard" width="40%" height="40%" />
        <h3 className="text-center text-sm font-bold tracking-tight drop-shadow-md text-gray-700">Concesi&oacute;n Emtel</h3>
      </div>
    </>
  );
};

export default Logo;
