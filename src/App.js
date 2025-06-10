import React from 'react';
import DicomViewer from './components/DicomViewer';
import './index.css';

function App() {
  return (
    <div className="app">
      <h1>DICOM Viewer</h1>
      <DicomViewer />
    </div>
  );
}

export default App;
