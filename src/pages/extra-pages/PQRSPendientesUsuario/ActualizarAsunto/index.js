import React from 'react';
import TypeAffair from './TypeAffair';

const IndexTypesAffairs = ({ setValueAffair, granted }) => {
  return (
    <div>
      <TypeAffair setValueAffair={setValueAffair} granted={granted} />
    </div>
  );
};

export default IndexTypesAffairs;
