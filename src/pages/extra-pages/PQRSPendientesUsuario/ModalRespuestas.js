import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';
import { FormWithParameter } from './Forms/FormWithParameter';
import { FormWithoutParameter } from './Forms/FormWithoutParameter';
import { useAuth } from 'context/authContext';
import { usePermissions } from 'hooks/usePermissions';
function ModalRespuestas({ open, handleClose, data, asignados, setAsignados }) {
  const { user } = useAuth();
  const { canViewAddAffairAnswer, canViewUploadFileAnswers } = usePermissions(user);
  return (
    <>
      <Dialog
        header="Cargue de respuestas"
        visible={open}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        onHide={() => {
          if (!open) return;
          handleClose();
        }}
      >
        {canViewUploadFileAnswers && <FormWithoutParameter data={data} handleClose={handleClose} />}
        {canViewAddAffairAnswer && (
          <FormWithParameter data={data} asignados={asignados} setAsignados={setAsignados} handleClose={handleClose} />
        )}
      </Dialog>
    </>
  );
}

export default ModalRespuestas;

ModalRespuestas.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object,
  handleClose: PropTypes.func,
  asignados: PropTypes.array,
  setAsignados: PropTypes.func
};
