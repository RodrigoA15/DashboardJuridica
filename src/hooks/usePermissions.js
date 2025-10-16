export const usePermissions = (user) => {
  const canViewMetricTotalReturned =
    (user.id_ciudad === 'Barranquilla' && user.id_sede === 'Principal') || user.role?.nombre_rol === 'admin';
  const canViewButtonUploadFile = (user.id_ciudad === 'Barranquilla' && user.id_sede === 'Principal') || user.role?.nombre_rol === 'admin';
  const canViewAddAffairAnswer = user.id_ciudad === 'Barranquilla' || user.id_ciudad === 'Cali' || user.role?.nombre_rol === 'admin';
  const canViewUploadFileAnswers = (user.id_ciudad === 'Popayan' && user.id_sede === 'Principal') || user.role?.nombre_rol === 'admin';
  const canViewCreateAprobations = (user.id_ciudad === 'Cali' && user.id_sede === 'Principal') || user.role?.nombre_rol === 'admin';

  return {
    canViewMetricTotalReturned,
    canViewButtonUploadFile,
    canViewAddAffairAnswer,
    canViewUploadFileAnswers,
    canViewCreateAprobations
  };
};
