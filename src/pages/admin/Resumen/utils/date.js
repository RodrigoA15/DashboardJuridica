/** Formatea una fecha a YYYY-MM-DD (valor compatible con input[type=date]). */
export const getFormattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Rango completo del mes actual (día 1 → último día).
 * @returns {{ startDate: string, endDate: string }}
 */
export const getCurrentMonthDateRange = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    startDate: getFormattedDate(new Date(year, month, 1)),
    endDate: getFormattedDate(new Date(year, month + 1, 0))
  };
};
