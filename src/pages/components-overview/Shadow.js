// material-ui

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function ComponentShadow() {
  return (
    <ComponentSkeleton>
      <MainCard title="Custom Shadow">
        <h1>Hola </h1>
      </MainCard>
    </ComponentSkeleton>
  );
}

export default ComponentShadow;
