import PropTypes from 'prop-types';

function PDFViewerAnswers({ dataAnswer }) {
  return (
    <>
      <a
        href={`http://192.168.28.74:4000/api/pdf-viewer-answer/${dataAnswer._id}`}
        target="_blank"
        rel="noreferrer"
        title="Ver archivo PDF"
      >
        Abrir
      </a>
    </>
  );
}

export default PDFViewerAnswers;

PDFViewerAnswers.propTypes = {
  dataAnswer: PropTypes.object.isRequired
};
