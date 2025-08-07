import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload({ onUpload, loading }) {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert('Please upload only PDF files under 5MB');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onUpload(file);
    }
  }, [onUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: loading
  });

  const getDropzoneClassName = () => {
    let className = 'dropzone';
    if (isDragActive) className += ' drag-active';
    if (isDragReject) className += ' drag-reject';
    if (loading) className += ' loading';
    return className;
  };

  return (
    <div className="file-upload-container">
      <div {...getRootProps()} className={getDropzoneClassName()}>
        <input {...getInputProps()} />
        
        <div className="dropzone-content">
          <div className="upload-icon">📄</div>
          
          {loading ? (
            <div className="upload-text">
              <h3>Processing your resume...</h3>
              <p>Preparing the roast... 🔥</p>
            </div>
          ) : isDragActive ? (
            <div className="upload-text">
              <h3>Drop your resume here!</h3>
              <p>Let's see what we're working with... 👀</p>
            </div>
          ) : (
            <div className="upload-text">
              <h3>Drop your PDF resume here</h3>
              <p>or <span className="upload-link">click to browse</span></p>
              <div className="upload-requirements">
                <span>📋 PDF only</span>
                <span>📏 Max 5MB</span>
                <span>🔥 Prepare for roasting</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="upload-tips">
        <h4>💡 Tips for better roasting:</h4>
        <ul>
          <li>Make sure your PDF has readable text (not just images)</li>
          <li>Include all sections: experience, education, skills</li>
          <li>One-page resumes get extra savage treatment 😈</li>
        </ul>
      </div>
    </div>
  );
}

export default FileUpload;