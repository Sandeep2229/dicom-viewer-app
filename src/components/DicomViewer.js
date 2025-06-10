import React, { useRef, useState } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

// Configure Cornerstone
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

function DicomViewer() {
    const viewerRef = useRef(null);
    const [metadata, setMetadata] = useState({});

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Read DICOM file
            const arrayBuffer = await file.arrayBuffer();

            // Load image
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            cornerstone.enable(viewerRef.current);
            const image = await cornerstone.loadAndCacheImage(imageId);
            cornerstone.displayImage(viewerRef.current, image);

            // Parse metadata
            const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));
            setMetadata({
                'Patient Name': dataSet.string('x00100010'),
                'Patient ID': dataSet.string('x00100020'),
                'Study Date': dataSet.string('x00080020'),
                'Modality': dataSet.string('x00080060'),
                'Image Width': dataSet.uint16('x00280011'),
                'Image Height': dataSet.uint16('x00280010')
            });
        } catch (error) {
            alert('Error loading DICOM file: ' + error.message);
        }
    };

    return (
        <div className="viewer-container">
            <div className="upload-section">
                <label className="upload-button">
                    Upload DICOM File
                    <input
                        type="file"
                        accept=".dcm"
                        onChange={handleFileUpload}
                        hidden
                    />
                </label>
            </div>

            <div
                ref={viewerRef}
                className="dicom-viewer"
            />

            <div className="metadata-section">
                <h2>DICOM Metadata</h2>
                <table>
                    <tbody>
                        {Object.entries(metadata).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DicomViewer;
