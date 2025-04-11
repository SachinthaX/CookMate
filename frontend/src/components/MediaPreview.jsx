import React from 'react';
import { Col, Row, CloseButton } from 'react-bootstrap';

const MediaPreview = ({ files, existingMedia, onRemove }) => {
  const previewFiles = [
    ...existingMedia.map((media, index) => ({
      url: media.url,
      type: media.fileType,
      isExisting: true
    })),
    ...files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      isExisting: false
    }))
  ];

  return (
    <Row className="g-2 mb-3">
      {previewFiles.map((file, index) => (
        <Col xs={6} md={4} key={index}>
          <div className="position-relative">
            {!file.isExisting && (
              <CloseButton
                className="position-absolute top-0 end-0 bg-white rounded-circle m-1"
                onClick={() => onRemove(index - existingMedia.length)}
              />
            )}
            
            {file.type.startsWith('image') ? (
              <img
                src={file.url}
                alt="Preview"
                className="img-fluid rounded"
                style={{ height: '200px', objectFit: 'cover' }}
              />
            ) : (
              <video
                controls
                className="w-100 rounded"
                style={{ height: '200px', objectFit: 'cover' }}
              >
                <source src={file.url} type={file.type} />
              </video>
            )}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default MediaPreview; 