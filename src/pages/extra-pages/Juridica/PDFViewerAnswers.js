// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';

function PDFViewerAnswers({ dataAnswer }) {
  return (
    <div>
      <a href={`http://localhost:4000/api/pdf-viewer-answer/${dataAnswer._id}`} target="_blank" rel="noreferrer" title="Ver archivo PDF">
        Abrir
      </a>
    </div>
  );
}

export default PDFViewerAnswers;
