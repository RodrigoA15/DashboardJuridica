import React from 'react';
import TypeAffair from './TypeAffair';

const IndexTypesAffairs = ({ valueAffair, setValueAffair, granted, typeAffair }) => {
  return (
    <div>
      <TypeAffair valueAffair={valueAffair} setValueAffair={setValueAffair} granted={granted} typeAffair={typeAffair} />
    </div>
  );
};

export default IndexTypesAffairs;
