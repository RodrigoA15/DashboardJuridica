import { CreadasApi } from 'pages/dashboard/creadasApi';
import { Card } from '../Card';
const AnalyticPQRSCreadas = () => {
  const { data } = CreadasApi();
  return (
    <>
      {data.map((item) => (
        <Card description={`PQRS ${item.entidad} 2025`} value={item.count} key={item.entidad} color="card1" />
      ))}
    </>
  );
};

export default AnalyticPQRSCreadas;
