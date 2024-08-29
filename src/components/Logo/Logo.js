// material-ui
import logoConcesion from '../../assets/images/auth/LogoConcesion.webp';
import logoAtlantico from '../../assets/images/auth/LogoAtlantico.webp';
import { Parameters } from 'hooks/useParameters';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const { parameters } = Parameters();
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
   
     *
     */
    <>
      {parameters.some((parametro) => parametro.nombre_parametro === 'Logo Atlantico' && parametro.activo === true) ? (
        <img src={logoAtlantico} alt="Consecion" width="60%" height="60%" />
      ) : (
        <img src={logoConcesion} alt="atlantico" width="60%" height="60%" />
      )}
    </>
  );
};

export default Logo;
