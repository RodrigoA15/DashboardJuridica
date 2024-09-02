import { Card } from '../Card';
const AnalyticPQRSCreadas = ({ description, value }) => {
  return (
    <>
      <Card description={`PQRS creadas ${description}`} value={value} color="card1" />
    </>
  );
};

export default AnalyticPQRSCreadas;
