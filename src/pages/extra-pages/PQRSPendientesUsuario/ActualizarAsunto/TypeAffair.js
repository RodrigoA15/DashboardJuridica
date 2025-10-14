import Affairs from './Affairs';

const TypeAffair = ({ valueAffair, setValueAffair, granted, typeAffair }) => {
  return (
    <>
      <Affairs valueAffair={valueAffair} typeAffair={typeAffair} setValueAffair={setValueAffair} granted={granted} />
    </>
  );
};

export default TypeAffair;
