import { useCallback } from 'react';
import { classNames } from 'primereact/utils';
import useDiasHabiles from 'hooks/useDate';

const getDiasLaborablesClass = (dias) => {
  return classNames('rounded-full flex justify-center items-center text-center font-bold w-8 h-8', {
    'bg-green-700 text-black': dias <= 5,
    'bg-yellow-500 text-black': dias >= 6 && dias <= 9,
    'bg-orange-500 text-black': dias >= 10 && dias <= 12,
    'bg-red-500 bg-gradient text-black': dias >= 13
  });
};

export const useBadge = () => {
  const { diasHabiles } = useDiasHabiles();

  const renderDiasLaborables = useCallback(
    (rowData) => {
      const dias = diasHabiles(rowData.fecha_radicado);
      return <div className={getDiasLaborablesClass(dias)}>{dias}</div>;
    },
    [diasHabiles]
  );

  return {
    renderDiasLaborables
  };
};
