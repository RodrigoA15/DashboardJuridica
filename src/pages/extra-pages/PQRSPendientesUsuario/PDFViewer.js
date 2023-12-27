import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PropTypes from 'prop-types';

function PDFViewer({ url }) {
  return (
    <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div>
          <div
            style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              height: '450px',
              width: '100%',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
          >
            {url ? (
              <Viewer fileUrl={url} theme="dark" />
            ) : (
              <div
                style={{
                  border: '2px dashed rgba(0, 0, 0, .3)',
                  fontSize: '2rem',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Preview area
              </div>
            )}
          </div>
        </div>
      </Worker>
    </div>
  );
}

export default PDFViewer;

PDFViewer.propTypes = {
  url: PropTypes.object
};
