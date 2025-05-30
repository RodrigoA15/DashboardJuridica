export const useFormatDate = () => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  return {
    formatDate
  };
};
