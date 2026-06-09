import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/authContext';
import * as Yup from 'yup';
import { Formik } from 'formik';
import config from 'config';

// Iconos de Formulario y App
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginIcon from '@mui/icons-material/Login';
import CircularProgress from '@mui/material/CircularProgress';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({
  primaryColor = '#C74C09',
  secondaryColor = '#983906',
  lightColor = '#F7D0B8',
  secretariaLogoUrl,
  backgroundImageUrl
}) => {
  const { signin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || config.defaultPath;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col font-sans"
      style={{
        '--theme-primary': primaryColor,
        '--theme-secondary': secondaryColor,
        '--theme-light': lightColor
      }}
    >
      {backgroundImageUrl ? (
        <>
          <img src={backgroundImageUrl} alt="Fondo Sistema" className="absolute inset-0 h-full w-full z-0" />
        </>
      ) : (
        <div className="absolute inset-0 h-full w-full bg-gray-900 z-0" />
      )}

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--theme-ligth)] via-[var(--theme-primary)] to-[var(--theme-secondary) opacity-90" />
      <header className="relative z-10 flex flex-col w-full justify-center px-6 pt-12 pb-4">
        {secretariaLogoUrl ? (
          <>
            <div className="relative flex items-center justify-end w-full">
              {/* Contenedor del logo, posicionado absolutamente en el centro horizontal */}
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pt-28">
                <img src={secretariaLogoUrl} alt="Secretaría de Movilidad" className="h-20 w-auto object-contain drop-shadow-lg" />
                <h3 className="mb-4 text-center text-sm font-bold tracking-tight drop-shadow-md text-gray-700">Alcaldia de Envigado</h3>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-16 w-48 items-center justify-center rounded border border-dashed border-white/40 bg-white/10 text-center text-xs font-semibold text-white/80 backdrop-blur-sm">
            [Logo Secretaría]
          </div>
        )}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 flex flex-1 w-full items-center justify-center px-6 py-8 lg:items-start lg:pt-4 lg:pb-12 lg:pl-10 lg:pr-16">
        <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row">
          {/* ---- RIGHT SIDE: Form Card ---- */}
          <div className="w-full max-w-md overflow-visible lg:w-5/12 lg:ml-auto">
            <div className="relative translate-x-[18px] translate-y-[155px]">
              <div className="rounded-3xl bg-white p-8 shadow-2xl backdrop-blur-xl sm:p-10 border border-gray/20">
                <div className="mb-8 text-center">
                  <div className="flex justify-center ">
                    <h2 className="text-3xl font-bold text-gray-800 mr-4">Iniciar</h2>
                    <h2 className="text-3xl font-bold text-[var(--theme-primary)]">Sesión</h2>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Ingresa tus credenciales para acceder al sistema</p>
                </div>

                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={Yup.object().shape({
                    username: Yup.string().max(30).required('El nombre de usuario es obligatorio'),
                    password: Yup.string().max(30).required('La contraseña es obligatoria')
                  })}
                  onSubmit={async (values, { setErrors, setSubmitting }) => {
                    try {
                      await signin({ username: values.username, password: values.password });
                    } catch (err) {
                      const message = err.response?.data?.message || err.response?.data?.error || 'Ocurrió un error al iniciar sesión.';
                      setErrors({ submit: message });
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className="space-y-5">
                      {/* Username */}
                      <div>
                        <label htmlFor="username-login" className="mb-1.5 block text-sm font-medium text-gray-700">
                          Nombre de usuario
                        </label>
                        <div className="relative">
                          <PersonOutlineIcon
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            sx={{ fontSize: 22 }}
                          />
                          <input
                            id="username-login"
                            name="username"
                            type="text"
                            value={values.username}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="ej. pedro.perez"
                            className={`block w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 shadow-inner transition focus:bg-white focus:outline-none focus:ring-2 ${
                              touched.username && errors.username
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                : 'border-gray-200 focus:border-[var(--theme-primary)] focus:ring-[var(--theme-light)]'
                            }`}
                          />
                        </div>
                        {touched.username && errors.username && (
                          <p className="mt-1.5 text-xs font-medium text-red-500">{errors.username}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label htmlFor="password-login" className="mb-1.5 block text-sm font-medium text-gray-700">
                          Contraseña
                        </label>
                        <div className="relative">
                          <LockOutlinedIcon
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            sx={{ fontSize: 22 }}
                          />
                          <input
                            id="password-login"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`block w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-12 text-gray-900 placeholder-gray-400 shadow-inner transition focus:bg-white focus:outline-none focus:ring-2 ${
                              touched.password && errors.password
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                : 'border-gray-200 focus:border-[var(--theme-primary)] focus:ring-[var(--theme-light)]'
                            }`}
                          />
                          <button
                            type="button"
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-[var(--theme-primary)] focus:outline-none"
                          >
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon sx={{ fontSize: 22 }} />
                            ) : (
                              <VisibilityOutlinedIcon sx={{ fontSize: 22 }} />
                            )}
                          </button>
                        </div>
                        {touched.password && errors.password && (
                          <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password}</p>
                        )}
                      </div>

                      {/* Error de Submit General */}
                      {errors.submit && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errors.submit}</div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--theme-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-light)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <CircularProgress size={22} sx={{ color: 'white' }} />
                        ) : (
                          <>
                            <LoginIcon sx={{ fontSize: 20 }} />
                            Iniciar sesi&oacute;n
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER: COPYRIGHT CENTRAL ================= */}
      <footer className="relative z-10 flex w-full justify-center px-6 pb-8 pt-4">
        <p className="text-center text-sm font-medium text-gray-500 drop-shadow-md">
          &copy; {new Date().getFullYear()} Quipux Popay&aacute;n.
        </p>
      </footer>
    </div>
  );
};

export default AuthLogin;
