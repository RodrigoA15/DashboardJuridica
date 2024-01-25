import { Viewer, Worker } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PropTypes from 'prop-types';

function PDFViewer({ url }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin(defaultLayoutPlugin);

  return (
    <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
}

export default PDFViewer;

PDFViewer.propTypes = {
  url: PropTypes.object
};
