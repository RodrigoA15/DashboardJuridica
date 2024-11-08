import Affairs from './Affairs';

const TypeAffair = ({ setValueAffair, granted, typeAffair }) => {
  return (
    <>
      <Affairs typeAffair={typeAffair} setValueAffair={setValueAffair} granted={granted} />
    </>
  );
};

export default TypeAffair;
