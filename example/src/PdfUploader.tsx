import React, { useRef } from "react";
import "./style/PdfUploader.css";

interface PdfUploaderProps {
  onPdfUpload: (file: File) => void;
  onClearUpload: () => void;
  hasUploadedPdf: boolean;
}

const PdfUploader = ({ onPdfUpload, onClearUpload, hasUploadedPdf }: PdfUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onPdfUpload(file);
    } else if (file) {
      alert('Please select a PDF file');
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClearUpload();
  };

  return (
    <div className="pdf-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="upload-controls">
        <button
          className="upload-btn"
          onClick={handleUploadClick}
          title="Upload your own PDF"
        >
          📁 Upload PDF
        </button>

        {hasUploadedPdf && (
          <button
            className="clear-btn"
            onClick={handleClearClick}
            title="Clear uploaded PDF and return to demo PDFs"
          >
            ✖ Clear
          </button>
        )}
      </div>

      <div className="upload-info">
        {hasUploadedPdf ? (
          <span className="upload-status">✓ Custom PDF loaded</span>
        ) : (
          <span className="upload-hint">Upload your own PDF to highlight</span>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;