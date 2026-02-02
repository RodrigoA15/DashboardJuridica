import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useAuth } from 'context/authContext';
function PDFViewerAnswers({ data }) {
  const { user } = useAuth();
  return (
    <Tooltip title="Ver PDF" placement="top" arrow>
      <IconButton
        component="a"
        href={`http://192.168.28.74:4000/api/v2/answer/pdf-viewer-answer/${data._id}`}
        target="_blank"
        rel="noreferrer"
        color="error"
        disabled={user.id_ciudad !== 'Popayan'}
      >
        <InsertDriveFileIcon />
      </IconButton>
    </Tooltip>
  );
}

PDFViewerAnswers.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};

export default PDFViewerAnswers;
