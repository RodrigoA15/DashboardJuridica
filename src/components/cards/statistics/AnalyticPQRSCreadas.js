import { memo } from 'react';
import { Card } from '../Card';
const AnalyticPQRSCreadas = memo(({ description, value }) => {
  return (
    <>
      <Card description={`PQRS ${description} 2025`} value={value} color="card1" />
    </>
  );
});

export default AnalyticPQRSCreadas;
