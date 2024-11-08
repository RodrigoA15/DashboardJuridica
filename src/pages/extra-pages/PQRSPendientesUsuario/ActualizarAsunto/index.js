import React from 'react';
import TypeAffair from './TypeAffair';

const IndexTypesAffairs = ({ setValueAffair, granted, typeAffair }) => {
  return (
    <div>
      <TypeAffair setValueAffair={setValueAffair} granted={granted} typeAffair={typeAffair} />
    </div>
  );
};

export default IndexTypesAffairs;
